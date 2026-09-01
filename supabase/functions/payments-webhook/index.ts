import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, createStripeClient, getWebhookSecret } from "../_shared/stripe.ts";
import { finalizeBookingFromSession } from "../_shared/finalizeBooking.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

  // Only act on session completion / payment success for our booking flow
  const isCheckoutCompleted = event.type === "checkout.session.completed";
  const isAsyncSuccess = event.type === "checkout.session.async_payment_succeeded";
  if (!isCheckoutCompleted && !isAsyncSuccess) {
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // ---- Idempotency gate ----------------------------------------------------
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
        .from("webhook_events").select("status,result").eq("event_id", event.id).maybeSingle();
      // Retry of an in-flight or completed event — acknowledge, don't reprocess.
      if (prior?.status !== "failed") {
        return new Response(`duplicate:${prior?.result ?? prior?.status ?? "seen"}`, { status: 200 });
      }
      // A previously failed event may be retried through to the logic below.
    } else {
      console.error("[payments-webhook] webhook_events claim failed", claim.error);
      // Transient DB problem — let Stripe retry.
      return new Response("could not record webhook event", { status: 500 });
    }
  }

  const finish = async (status: string, result: string, errorMessage?: string) => {
    await supabase.from("webhook_events")
      .update({ status, result, error_message: errorMessage ?? null })
      .eq("event_id", event.id);
  };

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
});
