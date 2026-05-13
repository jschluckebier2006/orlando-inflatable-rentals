import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("VITE_SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ---------- helpers ----------

function authHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

async function callFn(name: string, key: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: authHeaders(key),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* non-json */ }
  return { status: res.status, body: text, json };
}

async function rest(path: string, key: string, init: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...authHeaders(key), ...(init.headers as Record<string, string> ?? {}) },
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

const NOTE_MARKER = "edge-flow-test-row";
const futureDate = (offsetDays: number) => {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() + 5);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

function bookingPayload(extra: Record<string, unknown> = {}) {
  return {
    duration_type: "7hour",
    event_date: futureDate(1),
    event_start_time: "10:00",
    event_end_time: "17:00",
    customer_name: "EdgeFlow Tester",
    customer_email: "edgeflow@example.com",
    customer_phone: "555-0101",
    event_address_line: "1 Test St",
    event_city: "Orlando",
    event_zip: "32801",
    notes: NOTE_MARKER,
    items: [{
      product_id: `edgeflow-${crypto.randomUUID()}`,
      product_name: "Edge Flow Test Bouncer",
      product_price: 200,
    }],
    ...extra,
  };
}

const createdBookingIds: string[] = [];
const createdSessionIds: string[] = [];

// ---------- create-booking-checkout end-to-end ----------

Deno.test("create-booking-checkout: anon CAN invoke and pending_bookings is stashed via service role", async () => {
  const r = await callFn("create-booking-checkout", ANON_KEY, {
    duration_type: "7hour",
    event_date: futureDate(10),
    event_start_time: "10:00",
    event_end_time: "17:00",
    customer_name: "Checkout Tester",
    customer_email: "checkout-edgeflow@example.com",
    customer_phone: "555-0202",
    event_address_line: "1 Test St",
    event_city: "Orlando",
    event_zip: "32801",
    notes: NOTE_MARKER,
    items: [{
      product_id: `edgeflow-co-${crypto.randomUUID()}`,
      product_name: "Checkout Test Item",
      product_price: 250,
    }],
    payment_choice: "deposit",
    return_url: "https://example.com/return?session_id={CHECKOUT_SESSION_ID}",
    environment: "sandbox",
  });
  assertEquals(r.status, 200, r.body);
  assert(r.json?.clientSecret, "expected clientSecret");
  assert(r.json?.sessionId, "expected sessionId");
  assertEquals(r.json.amountCharged, 50, "deposit should be $50");
  assertEquals(Number(r.json.total), 250, "total should equal price * 1.0 multiplier");
  createdSessionIds.push(r.json.sessionId);

  // Verify pending_bookings was stashed.
  const sel = await rest(
    `pending_bookings?stripe_session_id=eq.${r.json.sessionId}&select=stripe_session_id,amount_total,amount_charged`,
    SERVICE_KEY,
  );
  assertEquals(sel.status, 200, sel.body);
  const rows = JSON.parse(sel.body);
  assertEquals(rows.length, 1);
  assertEquals(Number(rows[0].amount_total), 250);
  assertEquals(Number(rows[0].amount_charged), 50);
});

Deno.test("create-booking-checkout: anon CANNOT read pending_bookings even after the function inserted one", async () => {
  const sid = createdSessionIds[0];
  assert(sid, "previous test must have created a session");
  const r = await rest(
    `pending_bookings?stripe_session_id=eq.${sid}&select=id`,
    ANON_KEY,
  );
  assertEquals(r.status, 200, r.body);
  assertEquals(JSON.parse(r.body).length, 0, "RLS must hide pending_bookings from anon");
});

Deno.test("create-booking-checkout: rejects invalid payment_choice / amount", async () => {
  const r = await callFn("create-booking-checkout", ANON_KEY, {
    duration_type: "7hour",
    event_date: futureDate(15),
    event_start_time: "10:00",
    event_end_time: "17:00",
    customer_name: "Bad",
    customer_email: "bad@example.com",
    customer_phone: "555-0303",
    event_address_line: "1 St",
    event_city: "Orlando",
    event_zip: "32801",
    items: [{ product_id: "x", product_name: "x", product_price: 100 }],
    payment_choice: "custom",
    custom_amount: 10, // below $50 deposit floor
    return_url: "https://example.com/r",
    environment: "sandbox",
  });
  assertEquals(r.status, 400, r.body);
});

// ---------- check-booking-status end-to-end ----------

Deno.test("check-booking-status: anon CAN invoke; returns confirmed=false for unknown session", async () => {
  const r = await callFn("check-booking-status", ANON_KEY, {
    session_id: `cs_test_unknown_${crypto.randomUUID()}`,
  });
  assertEquals(r.status, 200, r.body);
  assertEquals(r.json?.confirmed, false);
});

Deno.test("check-booking-status: returns confirmed=true once a booking row exists for the session", async () => {
  // Tag a booking with a fake stripe_session_id via service role to simulate the webhook outcome.
  const sid = `cs_test_edgeflow_${crypto.randomUUID()}`;
  const ins = await rest("bookings", SERVICE_KEY, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      duration_type: "7hour",
      event_date: futureDate(20),
      event_end_date: futureDate(20),
      price_multiplier: 1.0,
      event_start_time: "10:00",
      event_end_time: "17:00",
      customer_name: "Status Tester",
      customer_email: "status@example.com",
      customer_phone: "555-0404",
      event_address_line: "1 St",
      event_city: "Orlando",
      event_zip: "32801",
      stripe_session_id: sid,
      status: "confirmed",
      notes: NOTE_MARKER,
    }),
  });
  assertEquals(ins.status, 201, ins.body);
  const id = JSON.parse(ins.body)[0].id;
  createdBookingIds.push(id);

  const r = await callFn("check-booking-status", ANON_KEY, { session_id: sid });
  assertEquals(r.status, 200, r.body);
  assertEquals(r.json?.confirmed, true);
});

Deno.test("check-booking-status: rejects missing session_id", async () => {
  const r = await callFn("check-booking-status", ANON_KEY, {});
  assertEquals(r.status, 400, r.body);
});

// ---------- Cleanup ----------

Deno.test("zz cleanup edge-flow test rows", async () => {
  for (const id of createdBookingIds) {
    await rest(`booking_items?booking_id=eq.${id}`, SERVICE_KEY, { method: "DELETE" });
    await rest(`bookings?id=eq.${id}`, SERVICE_KEY, { method: "DELETE" });
  }
  for (const sid of createdSessionIds) {
    await rest(`pending_bookings?stripe_session_id=eq.${sid}`, SERVICE_KEY, { method: "DELETE" });
  }
  // Sweep anything tagged with our marker.
  await rest(`bookings?notes=eq.${NOTE_MARKER}`, SERVICE_KEY, { method: "DELETE" });
});