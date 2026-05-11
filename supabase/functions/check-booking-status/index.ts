import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";
import { finalizeBookingFromSession } from "../_shared/finalizeBooking.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { session_id, attempt } = await req.json();
    if (!session_id || typeof session_id !== "string") {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) Cheap DB lookup. Webhook is the primary writer; this resolves
    //    in the happy path with zero Stripe API calls.
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("stripe_session_id", session_id)
      .maybeSingle();
    if (existing?.id) {
      return new Response(JSON.stringify({ confirmed: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Inline fallback. Only invoke Stripe starting at attempt 4 to keep
    //    Stripe API usage bounded if the webhook is delayed.
    const attemptNum = typeof attempt === "number" ? attempt : 0;
    if (attemptNum < 4) {
      return new Response(JSON.stringify({ confirmed: false, reason: "waiting_for_webhook" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pick env from the session prefix. Stripe Checkout Session IDs always
    // start with cs_live_ or cs_test_.
    const env: StripeEnv = session_id.startsWith("cs_live_") ? "live" : "sandbox";

    try {
      const stripe = createStripeClient(env);
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["payment_intent"],
      });
      // Map Stripe SDK Session to the minimal shape the helper needs.
      const result = await finalizeBookingFromSession(supabase, {
        id: session.id,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent as any,
        metadata: session.metadata as any,
      });
      const confirmed = result.status === "created" || result.status === "already_exists";
      return new Response(JSON.stringify({ confirmed, reason: result.status }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (stripeErr) {
      // Transient Stripe / network errors must not break the polling loop.
      console.error("[check-booking-status] stripe fallback failed", stripeErr);
      const msg = stripeErr instanceof Error ? stripeErr.message : "stripe error";
      return new Response(JSON.stringify({ confirmed: false, reason: "fallback_error", error: msg }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});