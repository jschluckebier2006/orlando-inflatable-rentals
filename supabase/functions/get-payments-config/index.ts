const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const live = Deno.env.get("STRIPE_LIVE_PUBLISHABLE_KEY");
  const sandbox = Deno.env.get("VITE_PAYMENTS_CLIENT_TOKEN") || Deno.env.get("STRIPE_SANDBOX_PUBLISHABLE_KEY");

  // Prefer live when the live publishable key is present and looks valid.
  const useLive = live && live.startsWith("pk_live_");
  const publishableKey = useLive ? live : sandbox || "";
  const environment = useLive ? "live" : "sandbox";

  return new Response(JSON.stringify({ publishableKey, environment }), {
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
    status: publishableKey ? 200 : 500,
  });
});