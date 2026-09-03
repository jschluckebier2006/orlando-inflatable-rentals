import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { loadSettings, lookupZoneIn } from "../_shared/settings.ts";
import { computeBreakdown, DEPOSIT_NET, DEPOSIT_CHARGE } from "../_shared/pricing.ts";
import { rentalEndDate } from "../_shared/rentalDates.ts";

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
  payment_choice: z.enum(["card_on_file", "cash_on_delivery"]),
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

    // ---- Date range validation (defense in depth) ----
    // Catch a malformed or impossible date here with a clear 400 rather than
    // letting it reach the availability triggers as an opaque 500.
    const startDate = new Date(`${d.event_date}T00:00:00Z`);
    if (Number.isNaN(startDate.getTime()) || startDate.toISOString().slice(0, 10) !== d.event_date) {
      return new Response(JSON.stringify({ error: "That event date isn't a valid calendar date." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const todayUtc = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
    if (startDate.getTime() < todayUtc.getTime() - 86400_000) {
      return new Response(JSON.stringify({ error: "That event date is in the past. Please pick a future date." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (startDate.getTime() > todayUtc.getTime() + 730 * 86400_000) {
      return new Response(JSON.stringify({ error: "That event date is too far out. Please call (407) 497-1840." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Multi-day rentals extend the end date; shared helper keeps this
    // identical to finalizeBooking so the two can never drift.
    const endDateStr = rentalEndDate(d.event_date, d.duration_type);
    if (endDateStr < d.event_date) {
      return new Response(JSON.stringify({ error: "Invalid rental date range." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Availability pre-check: don't take money for a date we can't serve.
    const { data: available, error: availErr } = await supabaseAdmin.rpc("is_date_range_available", {
      p_product_ids: d.items.map((i) => i.product_id),
      p_start: d.event_date,
      p_end: endDateStr,
      p_exclude_booking_id: "00000000-0000-0000-0000-000000000000",
    });
    if (availErr) {
      // A failed check is not a pass: never take money on dates we could not
      // verify as free.
      console.error("[create-booking-checkout] availability check failed", availErr);
      return new Response(JSON.stringify({
        error: "We couldn't confirm availability for those dates right now. Please try again or call (407) 497-1840.",
      }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } else if (available === false) {
      return new Response(JSON.stringify({
        error: "One or more of those items just became unavailable for your dates. Please pick another date or call (407) 497-1840.",
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Compute totals server-side (never trust the client)
    const subtotal = Math.round(d.items.reduce((s, i) => s + i.product_price, 0) * multiplier * 100) / 100;
    if (subtotal <= 0) {
      return new Response(JSON.stringify({ error: "Invalid total" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (subtotal < 100) {
      return new Response(JSON.stringify({
        error: `Order minimum is $100. Please add $${(100 - subtotal).toFixed(2)} more to continue.`,
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const bd = computeBreakdown(
      subtotal,
      d.damage_waiver !== false,
      deliveryFee,
      {
        taxRate: settings.taxRate,
        waiverRate: settings.damageWaiverRate,
        checkoutFeeRate: settings.onlineCheckoutFeeRate,
      },
      d.payment_choice,
    );
    const total = bd.total;
    const amountToCharge = DEPOSIT_CHARGE;
    const lineLabel = "Reservation deposit";

    const stripe = createStripeClient(d.environment as StripeEnv);

    // For card_on_file we must save the payment method on a Stripe Customer
    // so the admin can capture the remaining balance later. COD never saves the card.
    let customerId: string | undefined;
    if (d.payment_choice === "card_on_file") {
      try {
        const found = await stripe.customers.list({ email: d.customer_email, limit: 1 });
        customerId = found.data[0]?.id
          ?? (await stripe.customers.create({
            email: d.customer_email,
            name: d.customer_name,
            phone: d.customer_phone,
            metadata: { source: "orlandoinflatables.com", event_date: d.event_date },
          })).id;
      } catch (e) {
        console.error("stripe customer find/create failed", e);
      }
    }

    let session;
    try {
      session = await stripe.checkout.sessions.create({
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
      ...(customerId
        ? { customer: customerId }
        : { customer_email: d.customer_email }),
      payment_intent_data: {
        description: `Booking ${d.event_date} — ${d.customer_name}`,
        ...(d.payment_choice === "card_on_file"
          ? { setup_future_usage: "off_session" as const }
          : {}),
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
    } catch (stripeErr) {
      console.error("stripe.checkout.sessions.create failed", stripeErr);
      const msg = stripeErr instanceof Error ? stripeErr.message : String(stripeErr);
      return new Response(JSON.stringify({ error: `Payment provider error: ${msg}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!session.client_secret || !session.id) {
      console.error("session missing client_secret/id", JSON.stringify(session).slice(0, 1000));
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
      // Persist the server-trusted delivery fee/city + computed fee back into the payload
      // so the webhook records what we actually charged for, not what the client claimed.
      payload: {
        ...d,
        delivery_fee: deliveryFee,
        delivery_zone_city: deliveryZoneCity,
        checkout_fee_amount: bd.checkoutFee,
        stripe_customer_id: customerId ?? null,
      },
      amount_total: total,
      deposit_amount: DEPOSIT_NET,
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
