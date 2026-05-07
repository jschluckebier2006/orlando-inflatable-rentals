import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("VITE_SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MARKER = `webhook-test-${crypto.randomUUID()}`;

function headers(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

async function rest(path: string, key: string, init: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers(key), ...(init.headers as Record<string, string> ?? {}) },
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

function pendingPayload(sessionId: string) {
  return {
    stripe_session_id: sessionId,
    amount_total: 250.0,
    deposit_amount: 50,
    amount_charged: 50,
    payload: {
      duration_type: "7hour",
      event_date: "2099-01-15",
      event_start_time: "10:00",
      event_end_time: "17:00",
      customer_name: "Webhook Tester",
      customer_email: "webhook@example.com",
      customer_phone: "555-0102",
      event_address_line: "1 Test St",
      event_city: "Orlando",
      event_zip: "32801",
      notes: MARKER,
      damage_waiver: true,
      items: [{
        product_id: `webhook-${crypto.randomUUID()}`,
        product_name: "Webhook Test Item",
        product_price: 200,
      }],
    },
  };
}

const createdSessionIds: string[] = [];

// --- pending_bookings RLS / service-role insert path used by the webhook flow ---

Deno.test("webhook flow: service_role CAN insert and read pending_bookings (create-booking-checkout + webhook lookup paths)", async () => {
  const sessionId = `cs_test_${crypto.randomUUID()}`;
  createdSessionIds.push(sessionId);

  const insert = await rest("pending_bookings", SERVICE_KEY, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(pendingPayload(sessionId)),
  });
  assertEquals(insert.status, 201, insert.body);
  const inserted = JSON.parse(insert.body);
  assertEquals(inserted.length, 1);
  assertEquals(inserted[0].stripe_session_id, sessionId);

  const read = await rest(
    `pending_bookings?stripe_session_id=eq.${sessionId}&select=*`,
    SERVICE_KEY,
  );
  assertEquals(read.status, 200, read.body);
  const rows = JSON.parse(read.body);
  assertEquals(rows.length, 1);
  assertEquals(Number(rows[0].amount_charged), 50);
});

Deno.test("pending_bookings: anon CANNOT insert (RLS deny)", async () => {
  const sessionId = `cs_test_anon_${crypto.randomUUID()}`;
  const r = await rest("pending_bookings", ANON_KEY, {
    method: "POST",
    body: JSON.stringify(pendingPayload(sessionId)),
  });
  // 401 (no grants) or 403 (RLS) both acceptable; never 201
  assert(r.status >= 400, `expected denial, got ${r.status}: ${r.body}`);
  assert(r.status !== 201, `anon must not be allowed to create pending_bookings`);
});

Deno.test("pending_bookings: anon CANNOT read", async () => {
  const sessionId = createdSessionIds[0];
  const r = await rest(
    `pending_bookings?stripe_session_id=eq.${sessionId}&select=*`,
    ANON_KEY,
  );
  // RLS returns 200 + empty array; either way the row must not leak
  if (r.status === 200) {
    assertEquals(JSON.parse(r.body).length, 0, "anon must not see pending bookings");
  } else {
    assert(r.status >= 400);
  }
});

Deno.test("pending_bookings: anon CANNOT delete", async () => {
  const sessionId = createdSessionIds[0];
  const r = await rest(
    `pending_bookings?stripe_session_id=eq.${sessionId}`,
    ANON_KEY,
    { method: "DELETE" },
  );
  assert(r.status >= 400 || r.status === 204, `got ${r.status}`);
  // Confirm the row still exists via service role
  const after = await rest(
    `pending_bookings?stripe_session_id=eq.${sessionId}&select=stripe_session_id`,
    SERVICE_KEY,
  );
  assertEquals(JSON.parse(after.body).length, 1, "row must still exist after anon delete attempt");
});

// --- payments-webhook endpoint signature enforcement ---

Deno.test("payments-webhook: rejects requests missing stripe-signature", async () => {
  const r = await fetch(`${SUPABASE_URL}/functions/v1/payments-webhook?env=sandbox`, {
    method: "POST",
    headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "checkout.session.completed", data: { object: {} } }),
  });
  await r.text();
  assertEquals(r.status, 400, "missing signature must be rejected");
});

Deno.test("payments-webhook: rejects requests with an invalid stripe-signature", async () => {
  const r = await fetch(`${SUPABASE_URL}/functions/v1/payments-webhook?env=sandbox`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
      "stripe-signature": "t=1,v1=deadbeef",
    },
    body: JSON.stringify({ type: "checkout.session.completed", data: { object: {} } }),
  });
  await r.text();
  assertEquals(r.status, 400, "forged signature must be rejected");
});

// --- cleanup ---

Deno.test("cleanup: remove pending_bookings rows created by these tests", async () => {
  for (const sid of createdSessionIds) {
    await rest(`pending_bookings?stripe_session_id=eq.${sid}`, SERVICE_KEY, { method: "DELETE" });
  }
  // Sweep any stray bookings that slipped through (shouldn't exist; safety net)
  await rest(`bookings?notes=eq.${MARKER}`, SERVICE_KEY, { method: "DELETE" });
});