import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ItemSchema = z.object({
  product_id: z.string().min(1).max(100),
  product_name: z.string().min(1).max(200),
  product_price: z.number().nonnegative(),
});

const BookingSchema = z.object({
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
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
    if (parsed.data.event_end_time <= parsed.data.event_start_time) {
      return new Response(
        JSON.stringify({ error: "Pickup time must be after delivery time" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { items, ...header } = parsed.data;

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

    const itemRows = items.map((i) => ({ ...i, booking_id: booking.id }));
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
