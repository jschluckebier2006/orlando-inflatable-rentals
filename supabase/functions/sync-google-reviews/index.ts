import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: settings, error: settingsErr } = await supabase
      .from("app_settings")
      .select("google_place_id")
      .eq("id", 1)
      .maybeSingle();
    if (settingsErr) throw settingsErr;

    const placeId = settings?.google_place_id;
    if (!placeId) {
      return new Response(
        JSON.stringify({ ok: false, error: "google_place_id not configured in app_settings" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const gmapsKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!lovableKey || !gmapsKey) throw new Error("Google Maps connector not configured");

    const res = await fetch(
      `https://connector-gateway.lovable.dev/google_maps/places/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": gmapsKey,
          "X-Goog-FieldMask": "id,displayName,rating,userRatingCount",
        },
      },
    );
    const body = await res.json();
    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, status: res.status, error: body }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const count = typeof body.userRatingCount === "number" ? body.userRatingCount : null;
    const rating = typeof body.rating === "number" ? body.rating : null;

    const { error: updateErr } = await supabase
      .from("app_settings")
      .update({
        google_reviews_count: count,
        google_rating: rating,
        google_reviews_updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (updateErr) throw updateErr;

    return new Response(
      JSON.stringify({ ok: true, count, rating, name: body.displayName?.text ?? null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err?.message ?? err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});