// Admin-only, READ-ONLY reconciliation: lists paid Stripe Checkout Sessions in a
// window and reports the ones that have no matching row in public.bookings.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "forbidden" }, 403);

    const body = await req.json().catch(() => ({} as any));
    const sinceIso: string = body.since ?? "2026-08-20T00:00:00Z";
    const since = Math.floor(new Date(sinceIso).getTime() / 1000);
    const env: StripeEnv = body.environment === "sandbox" ? "sandbox" : "live";
    const stripe = createStripeClient(env);

    // All checkout sessions created since `since`
    const sessions: any[] = [];
    let startingAfter: string | undefined;
    for (let page = 0; page < 10; page++) {
      const res: any = await stripe.checkout.sessions.list({
        created: { gte: since },
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
        expand: ["data.payment_intent", "data.customer"],
      });
      sessions.push(...res.data);
      if (!res.has_more) break;
      startingAfter = res.data[res.data.length - 1]?.id;
    }

    const paid = sessions.filter((s) => s.payment_status === "paid");

    const sessionIds = paid.map((s) => s.id);
    const piIds = paid
      .map((s) => (typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id))
      .filter(Boolean);

    const { data: bySession } = await admin
      .from("bookings").select("id, stripe_session_id, stripe_payment_intent_id")
      .in("stripe_session_id", sessionIds.length ? sessionIds : ["__none__"]);
    const { data: byPi } = await admin
      .from("bookings").select("id, stripe_session_id, stripe_payment_intent_id")
      .in("stripe_payment_intent_id", piIds.length ? piIds : ["__none__"]);

    const matchedSessions = new Set((bySession ?? []).map((b: any) => b.stripe_session_id));
    const matchedPis = new Set((byPi ?? []).map((b: any) => b.stripe_payment_intent_id));

    const orphans: any[] = [];
    for (const s of paid) {
      const pi = typeof s.payment_intent === "string" ? null : s.payment_intent;
      const piId = typeof s.payment_intent === "string" ? s.payment_intent : pi?.id;
      if (matchedSessions.has(s.id) || (piId && matchedPis.has(piId))) continue;

      let lineItems: any[] = [];
      try {
        const li: any = await stripe.checkout.sessions.listLineItems(s.id, { limit: 20 });
        lineItems = li.data.map((l: any) => ({
          description: l.description,
          product_description: l.price?.product,
          amount_total: (l.amount_total ?? 0) / 100,
        }));
      } catch (_e) { /* non-fatal */ }

      const cust = typeof s.customer === "string" ? null : s.customer;
      const charge = pi?.latest_charge;

      orphans.push({
        session_id: s.id,
        payment_intent_id: piId ?? null,
        created: new Date(s.created * 1000).toISOString(),
        amount_paid: (s.amount_total ?? 0) / 100,
        currency: s.currency,
        payment_status: s.payment_status,
        customer_email: s.customer_details?.email ?? s.customer_email ?? cust?.email ?? null,
        customer_name: s.customer_details?.name ?? cust?.name ?? null,
        customer_phone: s.customer_details?.phone ?? cust?.phone ?? null,
        billing_address: s.customer_details?.address ?? null,
        session_metadata: s.metadata ?? null,
        payment_intent_metadata: pi?.metadata ?? null,
        payment_intent_description: pi?.description ?? null,
        stripe_customer_id: cust?.id ?? (typeof s.customer === "string" ? s.customer : null),
        latest_charge: typeof charge === "string" ? charge : charge?.id ?? null,
        line_items: lineItems,
      });
    }

    return json({
      window_start: sinceIso,
      environment: env,
      sessions_scanned: sessions.length,
      paid_sessions: paid.length,
      orphan_count: orphans.length,
      orphans,
    });
  } catch (err) {
    console.error("[stripe-reconcile]", err);
    return json({ error: err instanceof Error ? err.message : "error" }, 500);
  }
});
