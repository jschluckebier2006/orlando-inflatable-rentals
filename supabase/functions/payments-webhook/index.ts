import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, createStripeClient, getWebhookSecret } from "../_shared/stripe.ts";
import { finalizeBookingFromSession } from "../_shared/finalizeBooking.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** A claim older than this is treated as abandoned (crash / platform timeout). */
const STALE_CLAIM_MS = 5 * 60 * 1000;
/** A claim older than this raises a loud admin alert. */
const STUCK_ALERT_MS = 10 * 60 * 1000;

/**
 * Watchdog: any webhook_events row still `processing` past STUCK_ALERT_MS means a
 * paid order may be sitting unfinalized. Write one admin_audit_log alert per row
 * (deduped by error_message) so it can never fail silently.
 */
async function alertStuckClaims(supabase: any) {
  try {
    const cutoff = new Date(Date.now() - STUCK_ALERT_MS).toISOString();
    const { data: stuck } = await supabase
      .from("webhook_events")
      .select("event_id,event_type,session_id,payment_intent_id,updated_at,error_message")
      .eq("status", "processing")
      .lt("updated_at", cutoff)
      .limit(20);

    for (const row of stuck ?? []) {
      if (row.error_message === "watchdog_alerted") continue;
      await supabase.from("admin_audit_log").insert({
        actor_email: "system/webhook-watchdog",
        entity_type: "webhook_event",
        entity_id: row.event_id,
        action: "stuck_processing",
        summary: `Webhook event ${row.event_id} has been stuck in processing since ${row.updated_at}. A paid order may not have been finalized.`,
        before: {},
        after: {},
        metadata: {
          event_type: row.event_type,
          session_id: row.session_id,
          payment_intent_id: row.payment_intent_id,
          stuck_since: row.updated_at,
        },
      });
      await supabase.from("webhook_events")
        .update({ error_message: "watchdog_alerted" })
        .eq("event_id", row.event_id);
      console.error("[payments-webhook] STUCK CLAIM", row.event_id, row.session_id);
    }
  } catch (e) {
    console.error("[payments-webhook] watchdog failed", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const env = (url.searchParams.get("env") === "live" ? "live" : "sandbox") as StripeEnv;
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  let event: any;
  try {
    const stripe = createStripeClient(env);
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, getWebhookSecret(env));
  } catch (err) {
    console.error("Signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Watchdog runs on every delivery, regardless of event type.
  await alertStuckClaims(supabase);

  // Only act on session completion / payment success for our booking flow
  const isCheckoutCompleted = event.type === "checkout.session.completed";
  const isAsyncSuccess = event.type === "checkout.session.async_payment_succeeded";
  if (!isCheckoutCompleted && !isAsyncSuccess) {
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object;

  const finish = async (status: string, result: string, errorMessage?: string) => {
    await supabase.from("webhook_events")
      .update({ status, result, error_message: errorMessage ?? null })
      .eq("event_id", event.id);
  };

  try {
    // ---- Idempotency gate --------------------------------------------------
    // Claim this Stripe event.id. The UNIQUE constraint on webhook_events.event_id
    // means only one concurrent delivery can win; Stripe retries of an event we
    // already handled short-circuit here and can never double-book.
    const claim = await supabase.from("webhook_events").insert({
      event_id: event.id,
      event_type: event.type,
      session_id: session.id,
      payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
      status: "processing",
    }).select("id").maybeSingle();

    if (claim.error) {
      if ((claim.error as any).code === "23505") {
        const { data: prior } = await supabase
          .from("webhook_events").select("status,result,updated_at").eq("event_id", event.id).maybeSingle();

        if (prior?.status === "processing") {
          // A crashed or timed-out run leaves the claim stuck forever and every
          // retry would answer "duplicate". Take the claim over once it is stale.
          const age = Date.now() - new Date(prior.updated_at as string).getTime();
          if (age < STALE_CLAIM_MS) {
            return new Response("duplicate:in_flight", { status: 200 });
          }
          const takeover = await supabase.from("webhook_events")
            .update({ updated_at: new Date().toISOString(), error_message: "reclaimed_after_stale_processing" })
            .eq("event_id", event.id)
            .eq("status", "processing")
            .lt("updated_at", new Date(Date.now() - STALE_CLAIM_MS).toISOString())
            .select("id");
          if (takeover.error || !takeover.data?.length) {
            // Another delivery won the takeover race.
            return new Response("duplicate:in_flight", { status: 200 });
          }
          console.warn("[payments-webhook] reclaimed stale claim", event.id);
        } else if (prior?.status !== "failed") {
          // Retry of an event we already completed — acknowledge, don't reprocess.
          return new Response(`duplicate:${prior?.result ?? prior?.status ?? "seen"}`, { status: 200 });
        }
        // A previously failed event may be retried through to the logic below.
      } else {
        console.error("[payments-webhook] webhook_events claim failed", claim.error);
        // Transient DB problem — let Stripe retry.
        return new Response("could not record webhook event", { status: 500 });
      }
    }

    // Re-fetch the session with payment_intent expanded so finalizeBookingFromSession
    // can read the saved payment_method (off_session card-on-file) and customer.
    let fullSession: any = session;
    try {
      const stripe = createStripeClient(env);
      fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["payment_intent"],
      });
    } catch (e) {
      console.error("[payments-webhook] expand session failed", e);
    }

    // Heartbeat: the age test above must measure real staleness, not claim age.
    await supabase.from("webhook_events")
      .update({ updated_at: new Date().toISOString() })
      .eq("event_id", event.id);

    const result = await finalizeBookingFromSession(supabase, fullSession);

    if (result.status === "error") {
      // Genuinely transient / unknown — mark failed so a Stripe retry re-runs it.
      await finish("failed", result.status, result.message);
      return new Response(result.message ?? "finalize error", { status: 500 });
    }

    // needs_review is a TERMINAL outcome: the booking is persisted and an admin is
    // alerted. Returning 200 stops Stripe from retrying into the same failure.
    await finish("completed", result.status, result.status === "needs_review" ? result.message : null);
    return new Response(result.status, { status: 200 });
  } catch (e) {
    // Never leave the claim stuck at `processing`: mark it failed so the next
    // Stripe retry genuinely reprocesses instead of answering "duplicate".
    const message = e instanceof Error ? e.message : String(e);
    console.error("[payments-webhook] unhandled error", message);
    try {
      await finish("failed", "unhandled_error", message);
    } catch (inner) {
      console.error("[payments-webhook] could not mark event failed", inner);
    }
    return new Response(`unhandled error: ${message}`, { status: 500 });
  }
});
