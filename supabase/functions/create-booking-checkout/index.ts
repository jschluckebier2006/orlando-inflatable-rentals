import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ItemSchema = z.object({
  product_id: z.string().min(1).max(100),
  product_name: z.string().min(1).max(200),
  product_price: z.number().nonnegative(),
  unit_price: z.number().nonnegative().optional(),
});

const PayloadSchema = z.object({
  duration_type: z.enum(["7hour", "overnight", "weekend"]).default("7hour"),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  event_start_time: z.string().min(1).max(20),
  event_end_time: z.string().min(1).max(20),
  event_type: z.string().max(100).optional().nullable(),
  customer_name: z.string().trim().min(1).max(120),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().min(7).max(40),
  event_address_line: z.string().trim().min(1).max(200),
  event_city: z.string().trim().min(1).max(100),
  event_zip: z.string().trim().min(3).max(20),
  notes: z.string().max(2000).optional().nullable(),
  items: z.array(ItemSchema).min(1).max(20),
  payment_choice: z.enum(["deposit", "full", "custom"]),
  custom_amount: z.number().positive().optional(),
  return_url: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

const SERVER_MULT: Record<string, number> = { "7hour": 1.0, overnight: 1.25, weekend: 1.6 };
const DEPOSIT = 50;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const parsed = PayloadSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const d = parsed.data;
    const multiplier = SERVER_MULT[d.duration_type];

    // Compute totals server-side (never trust the client)
    const total = Math.round(d.items.reduce((s, i) => s + i.product_price, 0) * multiplier * 100) / 100;
    if (total <= 0) {
      return new Response(JSON.stringify({ error: "Invalid total" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let amountToCharge: number;
    let lineLabel: string;
    if (d.payment_choice === "deposit") {
      amountToCharge = DEPOSIT;
      lineLabel = "Non-refundable rental deposit";
    } else if (d.payment_choice === "full") {
      amountToCharge = total;
      lineLabel = "Rental — paid in full";
    } else {
      if (!d.custom_amount || d.custom_amount < DEPOSIT || d.custom_amount > total) {
        return new Response(JSON.stringify({ error: `Custom amount must be between $${DEPOSIT} and $${total.toFixed(2)}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      amountToCharge = Math.round(d.custom_amount * 100) / 100;
      lineLabel = "Rental partial payment";
    }

    const stripe = createStripeClient(d.environment as StripeEnv);
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: lineLabel,
            description: d.items.map((i) => i.product_name).join(", ").slice(0, 480),
          },
          unit_amount: Math.round(amountToCharge * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: d.return_url,
      customer_email: d.customer_email,
      payment_intent_data: {
        description: `Booking ${d.event_date} — ${d.customer_name}`,
        metadata: {
          customer_name: d.customer_name,
          event_date: d.event_date,
          payment_choice: d.payment_choice,
        },
      },
      metadata: {
        kind: "booking",
        event_date: d.event_date,
        customer_email: d.customer_email,
        payment_choice: d.payment_choice,
      },
    });

    if (!session.client_secret || !session.id) {
      return new Response(JSON.stringify({ error: "Could not create checkout session" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stash the booking payload until the webhook confirms payment
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error: stashErr } = await supabase.from("pending_bookings").insert({
      stripe_session_id: session.id,
      payload: d,
      amount_total: total,
      deposit_amount: DEPOSIT,
      amount_charged: amountToCharge,
    });
    if (stashErr) {
      console.error("pending_bookings insert failed", stashErr);
      return new Response(JSON.stringify({ error: "Could not stash booking" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      clientSecret: session.client_secret,
      sessionId: session.id,
      amountCharged: amountToCharge,
      total,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-booking-checkout error", err);
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
