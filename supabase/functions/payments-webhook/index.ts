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
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const result = await finalizeBookingFromSession(supabase, fullSession);
  if (result.status === "error") {
    return new Response(result.message ?? "finalize error", { status: 500 });
  }
  return new Response(result.status, { status: 200 });
});
