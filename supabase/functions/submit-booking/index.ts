import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
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

const BookingSchema = z.object({
  duration_type: z.enum(["7hour", "overnight", "weekend"]).default("7hour"),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  event_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  price_multiplier: z.number().positive().optional(),
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
  delivery_fee: z.number().nonnegative().max(500).optional(),
  delivery_zone_city: z.string().max(120).optional().nullable(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const parsed = BookingSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const d = parsed.data;

    // Server-side enforcement of tier rules
    const SERVER_MULT: Record<string, number> = { "7hour": 1.0, overnight: 1.25, weekend: 1.6 };
    const multiplier = SERVER_MULT[d.duration_type];

    // Compute end date
    const startDate = new Date(d.event_date + "T00:00:00Z");
    const endDate = new Date(startDate);
    if (d.duration_type !== "7hour") endDate.setUTCDate(endDate.getUTCDate() + 1);
    const endDateStr = endDate.toISOString().slice(0, 10);

    // Force time defaults for multi-day tiers
    let event_start_time = d.event_start_time;
    let event_end_time = d.event_end_time;
    if (d.duration_type === "overnight") {
      event_end_time = "08:00";
    } else if (d.duration_type === "weekend") {
      event_start_time = "08:00";
      event_end_time = "20:00";
      // Must be a Saturday
      if (startDate.getUTCDay() !== 6) {
        return new Response(
          JSON.stringify({ error: "Full Weekend rentals must start on a Saturday" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    } else {
      // 7-hour: pickup must be after delivery
      if (event_end_time <= event_start_time) {
        return new Response(
          JSON.stringify({ error: "Pickup time must be after delivery time" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const settings = await loadSettings(supabase);
    const TAX_RATE = settings.taxRate;
    const WAIVER_RATE = settings.damageWaiverRate;

    const { items, ...rest } = d;

    // Server-side zone validation
    const zone = lookupZoneIn(settings.zones, d.event_zip);
    if (!zone) {
      return new Response(JSON.stringify({
        error: "We don't service this ZIP for online booking. Please call (407) 497-1840.",
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (zone.status === "call") {
      return new Response(JSON.stringify({
        error: `${zone.city} requires a phone quote. Please call (407) 497-1840.`,
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const deliveryFee = zone.status === "paid" ? Math.round(zone.fee * 100) / 100 : 0;
    const deliveryZoneCity = zone.city;

    // Server-side recompute of money values (never trust the client)
    const subtotal = Math.round(items.reduce((s, i) => s + i.product_price, 0) * multiplier * 100) / 100;
    if (subtotal < 100) {
      return new Response(JSON.stringify({
        error: `Order minimum is $100. Please add $${(100 - subtotal).toFixed(2)} more to continue.`,
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const damage_waiver_amount = d.damage_waiver ? Math.round(subtotal * WAIVER_RATE * 100) / 100 : 0;
    const tax_amount = Math.round((subtotal + damage_waiver_amount + deliveryFee) * TAX_RATE * 100) / 100;
    const total_amount = Math.round((subtotal + damage_waiver_amount + deliveryFee + tax_amount) * 100) / 100;

    const header = {
      ...rest,
      event_start_time,
      event_end_time,
      event_end_date: endDateStr,
      price_multiplier: multiplier,
      subtotal,
      damage_waiver_selected: d.damage_waiver,
      damage_waiver_amount,
      tax_rate: TAX_RATE,
      tax_amount,
      delivery_fee: deliveryFee,
      delivery_zone_city: deliveryZoneCity,
      total_amount,
      balance_due: total_amount,
    };
    // damage_waiver isn't a column on bookings — strip it
    delete (header as any).damage_waiver;

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert(header)
      .select("id")
      .single();

    if (bookingErr || !booking) {
      console.error("Insert booking failed", bookingErr);
      return new Response(JSON.stringify({ error: "Could not save booking" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const itemRows = items.map((i) => ({
      product_id: i.product_id,
      product_name: i.product_name,
      product_price: i.product_price,
      unit_price: Math.round(i.product_price * multiplier * 100) / 100,
      booking_id: booking.id,
    }));
    const { error: itemsErr } = await supabase.from("booking_items").insert(itemRows);

    if (itemsErr) {
      // Conflict from the prevent_double_booking trigger
      await supabase.from("bookings").delete().eq("id", booking.id);
      const isConflict = (itemsErr as any).code === "P0001"
        || /already booked/i.test(itemsErr.message ?? "");
      return new Response(
        JSON.stringify({
          error: isConflict
            ? "One or more items were just booked for that date. Please pick another date or remove those items."
            : "Could not save booking items",
        }),
        { status: isConflict ? 409 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ id: booking.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-booking error", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
