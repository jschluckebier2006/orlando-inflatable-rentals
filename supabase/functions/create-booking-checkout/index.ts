import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { loadSettings, lookupZoneIn } from "../_shared/settings.ts";

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
  damage_waiver: z.boolean().optional().default(true),
  payment_choice: z.enum(["deposit", "full", "custom", "deposit_cash"]),
  custom_amount: z.number().positive().optional(),
  // Optional client-supplied delivery fee — server re-validates from the zip.
  delivery_fee: z.number().nonnegative().max(500).optional(),
  delivery_zone_city: z.string().max(120).optional().nullable(),
  return_url: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

const SERVER_MULT: Record<string, number> = { "7hour": 1.0, overnight: 1.25, weekend: 1.6 };

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

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const settings = await loadSettings(supabaseAdmin);
    const TAX_RATE = settings.taxRate;
    const WAIVER_RATE = settings.damageWaiverRate;
    const DEPOSIT = settings.defaultDeposit;

    // ---- Server-side delivery-zone validation (defense in depth) ----
    const zone = lookupZoneIn(settings.zones, d.event_zip);
    if (!zone) {
      return new Response(JSON.stringify({
        error: "We don't service this ZIP for online booking. Please call (407) 497-1840.",
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (zone.status === "call") {
      return new Response(JSON.stringify({
        error: `${zone.city} requires a phone quote. Please call (407) 497-1840 to book this area.`,
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const deliveryFee = zone.status === "paid" ? Math.round(zone.fee * 100) / 100 : 0;
    const deliveryZoneCity = zone.city;

    // Compute totals server-side (never trust the client)
    const subtotal = Math.round(d.items.reduce((s, i) => s + i.product_price, 0) * multiplier * 100) / 100;
    if (subtotal <= 0) {
      return new Response(JSON.stringify({ error: "Invalid total" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const damage_waiver_amount = d.damage_waiver ? Math.round(subtotal * WAIVER_RATE * 100) / 100 : 0;
    const tax_amount = Math.round((subtotal + damage_waiver_amount + deliveryFee) * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + damage_waiver_amount + deliveryFee + tax_amount) * 100) / 100;

    let amountToCharge: number;
    let lineLabel: string;
    if (d.payment_choice === "deposit") {
      amountToCharge = DEPOSIT;
      lineLabel = "Non-refundable rental deposit";
    } else if (d.payment_choice === "deposit_cash") {
      amountToCharge = DEPOSIT;
      lineLabel = "Non-refundable rental deposit (cash balance on delivery)";
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
      // Persist the server-trusted delivery fee/city back into the payload so the
      // webhook records what we actually charged for, not what the client claimed.
      payload: { ...d, delivery_fee: deliveryFee, delivery_zone_city: deliveryZoneCity },
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
