// Reconciliation: lists Stripe Checkout Sessions in a window and reports the
// ones that took real money and have no matching row in public.bookings.
//
// Two entry modes:
//   * admin  — an authenticated admin POSTs and gets the full orphan report back.
//   * cron   — the daily pg_cron job POSTs with x-cron-secret; orphans raise an
//              admin alert email instead of being returned to a browser.
//
// A charge only counts as an orphan if money is still held. A FULLY refunded
// charge is a normal, closed outcome — not a lost booking — so it is excluded.
// A PARTIALLY refunded charge is still flagged, because money remains.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";
import { sendEmail, ADMIN_EMAILS } from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type RefundState = {
  amount: number;
  amount_refunded: number;
  fully_refunded: boolean;
  partially_refunded: boolean;
  charge_id: string | null;
};

/**
 * Decide whether a session's money is still held.
 * Prefers the Charge (authoritative on refunds), falls back to the PaymentIntent.
 */
function refundState(pi: any, charge: any): RefundState {
  // Charge-level is the most precise signal.
  if (charge && typeof charge === "object") {
    const amount = Number(charge.amount ?? 0);
    const refunded = Number(charge.amount_refunded ?? 0);
    const flag = charge.refunded === true;
    return {
      amount: amount / 100,
      amount_refunded: refunded / 100,
      fully_refunded: flag || (amount > 0 && refunded >= amount),
      partially_refunded: !flag && refunded > 0 && refunded < amount,
      charge_id: charge.id ?? null,
    };
  }
  // PaymentIntent fallback.
  const amount = Number(pi?.amount_received ?? pi?.amount ?? 0);
  const refunded = Number(pi?.amount_refunded ?? 0);
  return {
    amount: amount / 100,
    amount_refunded: refunded / 100,
    fully_refunded: amount > 0 && refunded >= amount,
    partially_refunded: refunded > 0 && refunded < amount,
    charge_id: typeof pi?.latest_charge === "string" ? pi.latest_charge : pi?.latest_charge?.id ?? null,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const body = await req.json().catch(() => ({} as any));

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ---- AuthN: either the cron shared secret, or an admin user JWT ----
    const cronSecret = Deno.env.get("RECONCILE_CRON_SECRET");
    const presentedSecret = req.headers.get("x-cron-secret");
    const isCron = Boolean(cronSecret && presentedSecret && presentedSecret === cronSecret);

    if (!isCron) {
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
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "forbidden" }, 403);
    }

    const env: StripeEnv = body.environment === "sandbox" ? "sandbox" : "live";
    const stripe = createStripeClient(env);

    // ---- Optional targeted lookup of a single session -----------------------
    if (body.session_id) {
      const s: any = await stripe.checkout.sessions.retrieve(body.session_id, {
        expand: ["payment_intent", "payment_intent.latest_charge"],
      });
      const pi = typeof s.payment_intent === "string" ? null : s.payment_intent;
      const charge = pi && typeof pi.latest_charge === "object" ? pi.latest_charge : null;
      return json({
        session_id: s.id,
        status: s.status,
        payment_status: s.payment_status,
        created: new Date(s.created * 1000).toISOString(),
        expires_at: s.expires_at ? new Date(s.expires_at * 1000).toISOString() : null,
        amount_total: (s.amount_total ?? 0) / 100,
        payment_intent_id: typeof s.payment_intent === "string" ? s.payment_intent : pi?.id ?? null,
        payment_intent_status: pi?.status ?? null,
        charge_status: charge?.status ?? null,
        refunds: pi || charge ? refundState(pi, charge) : null,
        customer_details: s.customer_details ?? null,
        metadata: s.metadata ?? null,
      });
    }

    // ---- Window ------------------------------------------------------------
    const sinceIso: string = body.since
      ?? (body.days
        ? new Date(Date.now() - Number(body.days) * 86400_000).toISOString()
        : "2026-08-20T00:00:00Z");
    const since = Math.floor(new Date(sinceIso).getTime() / 1000);

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
    const refundedExcluded: any[] = [];

    for (const s of paid) {
      const pi = typeof s.payment_intent === "string" ? null : s.payment_intent;
      const piId = typeof s.payment_intent === "string" ? s.payment_intent : pi?.id;
      if (matchedSessions.has(s.id) || (piId && matchedPis.has(piId))) continue;

      // ---- Refund check. A fully refunded charge is NOT an orphan. ----------
      // Retrieve the charge explicitly so amount_refunded/refunded are always
      // authoritative, regardless of how the list expansion resolved.
      let charge: any = null;
      let refunds: RefundState | null = null;
      try {
        const fullPi: any = piId
          ? await stripe.paymentIntents.retrieve(piId, { expand: ["latest_charge"] })
          : null;
        charge = fullPi && typeof fullPi.latest_charge === "object" ? fullPi.latest_charge : null;
        refunds = refundState(fullPi ?? pi, charge);
      } catch (_e) {
        refunds = refundState(pi, null);
      }

      if (refunds?.fully_refunded) {
        // Normal closed outcome — money returned, no booking expected.
        refundedExcluded.push({
          session_id: s.id,
          payment_intent_id: piId ?? null,
          amount: refunds.amount,
          amount_refunded: refunds.amount_refunded,
          customer_email: s.customer_details?.email ?? s.customer_email ?? null,
          reason: "fully refunded — excluded from orphan list",
        });
        continue;
      }

      let lineItems: any[] = [];
      try {
        const li: any = await stripe.checkout.sessions.listLineItems(s.id, { limit: 20 });
        lineItems = li.data.map((l: any) => ({
          description: l.description,
          amount_total: (l.amount_total ?? 0) / 100,
        }));
      } catch (_e) { /* non-fatal */ }

      const cust = typeof s.customer === "string" ? null : s.customer;

      orphans.push({
        session_id: s.id,
        payment_intent_id: piId ?? null,
        created: new Date(s.created * 1000).toISOString(),
        amount_paid: (s.amount_total ?? 0) / 100,
        currency: s.currency,
        payment_status: s.payment_status,
        partially_refunded: refunds?.partially_refunded ?? false,
        amount_refunded: refunds?.amount_refunded ?? 0,
        customer_email: s.customer_details?.email ?? s.customer_email ?? cust?.email ?? null,
        customer_name: s.customer_details?.name ?? cust?.name ?? null,
        customer_phone: s.customer_details?.phone ?? cust?.phone ?? null,
        billing_address: s.customer_details?.address ?? null,
        session_metadata: s.metadata ?? null,
        payment_intent_metadata: pi?.metadata ?? null,
        stripe_customer_id: cust?.id ?? (typeof s.customer === "string" ? s.customer : null),
        latest_charge: refunds?.charge_id ?? null,
        line_items: lineItems,
      });
    }

    const report = {
      window_start: sinceIso,
      environment: env,
      mode: isCron ? "cron" : "admin",
      sessions_scanned: sessions.length,
      paid_sessions: paid.length,
      refunded_excluded_count: refundedExcluded.length,
      refunded_excluded: refundedExcluded,
      orphan_count: orphans.length,
      orphans,
    };

    // ---- Cron: alert on anything still holding money ------------------------
    if (isCron && orphans.length > 0) {
      const esc = (v: unknown) =>
        String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
      const rows = orphans.map((o) => `
<tr>
  <td style="padding:6px;border-bottom:1px solid #e6e9ef;">${esc(o.customer_name)}<br><small>${esc(o.customer_email)}</small></td>
  <td style="padding:6px;border-bottom:1px solid #e6e9ef;">$${esc(o.amount_paid)}${o.partially_refunded ? ` <em>(partial refund $${esc(o.amount_refunded)})</em>` : ""}</td>
  <td style="padding:6px;border-bottom:1px solid #e6e9ef;"><small>${esc(o.payment_intent_id)}<br>${esc(o.session_id)}</small></td>
</tr>`).join("");
      await sendEmail({
        to: ADMIN_EMAILS,
        subject: `🚨 ${orphans.length} Stripe charge(s) with no booking`,
        html: `<h2 style="color:#c0392b;">Reconciliation found unmatched charges</h2>
<p>These Stripe payments took money and have no booking in the system. Fully refunded charges are excluded automatically.</p>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;width:100%;">
<tr><th align="left" style="padding:6px;">Customer</th><th align="left" style="padding:6px;">Amount</th><th align="left" style="padding:6px;">Stripe refs</th></tr>
${rows}</table>`,
        from: "alerts",
        templateName: "reconcile_orphans_admin",
        idempotencyKey: `reconcile:${new Date().toISOString().slice(0, 10)}:${orphans.map((o) => o.session_id).sort().join(",").slice(0, 200)}`,
        payloadSnapshot: report,
      });
    }

    return json(report);
  } catch (err) {
    console.error("[stripe-reconcile]", err);
    return json({ error: err instanceof Error ? err.message : "error" }, 500);
  }
});
