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

// ---------- submit-booking end-to-end ----------

Deno.test("submit-booking: anon CAN invoke and the function creates a booking + items via service role", async () => {
  const payload = bookingPayload();
  const r = await callFn("submit-booking", ANON_KEY, payload);
  assertEquals(r.status, 200, r.body);
  assert(r.json?.id, "expected booking id in response");
  createdBookingIds.push(r.json.id);

  // Verify the booking was actually inserted (read with service role).
  const sel = await rest(
    `bookings?id=eq.${r.json.id}&select=id,customer_email,event_date`,
    SERVICE_KEY,
  );
  assertEquals(sel.status, 200, sel.body);
  const rows = JSON.parse(sel.body);
  assertEquals(rows.length, 1);
  assertEquals(rows[0].customer_email, payload.customer_email);
  assertEquals(rows[0].event_date, payload.event_date);

  // Verify booking_items were created and linked.
  const items = await rest(
    `booking_items?booking_id=eq.${r.json.id}&select=product_id,unit_price`,
    SERVICE_KEY,
  );
  assertEquals(items.status, 200, items.body);
  const itemRows = JSON.parse(items.body);
  assertEquals(itemRows.length, 1);
  assertEquals(itemRows[0].product_id, payload.items[0].product_id);
  // unit_price = product_price * multiplier(1.0) for 7hour
  assertEquals(Number(itemRows[0].unit_price), 200);
});

Deno.test("submit-booking: anon CANNOT read back the booking it just created (RLS blocks SELECT)", async () => {
  const id = createdBookingIds[0];
  assert(id, "previous test must have created a booking");
  const sel = await rest(`bookings?id=eq.${id}&select=id`, ANON_KEY);
  assertEquals(sel.status, 200, sel.body);
  assertEquals(JSON.parse(sel.body).length, 0, "RLS should hide the row from anon");

  const items = await rest(`booking_items?booking_id=eq.${id}&select=id`, ANON_KEY);
  assertEquals(items.status, 200, items.body);
  assertEquals(JSON.parse(items.body).length, 0, "RLS should hide booking_items from anon");
});

Deno.test("submit-booking: double-booking trigger fires when the same product is booked on the same date", async () => {
  const productId = `edgeflow-conflict-${crypto.randomUUID()}`;
  const date = futureDate(2);
  const first = await callFn("submit-booking", ANON_KEY, bookingPayload({
    event_date: date,
    items: [{ product_id: productId, product_name: "Conflict Item", product_price: 100 }],
  }));
  assertEquals(first.status, 200, first.body);
  createdBookingIds.push(first.json.id);

  const second = await callFn("submit-booking", ANON_KEY, bookingPayload({
    event_date: date,
    items: [{ product_id: productId, product_name: "Conflict Item", product_price: 100 }],
  }));
  assertEquals(second.status, 409, `expected conflict, got ${second.status}: ${second.body}`);
  assert(/already booked/i.test(second.body), `expected conflict message, got: ${second.body}`);
});

Deno.test("submit-booking: rejects invalid input (zod 400)", async () => {
  const r = await callFn("submit-booking", ANON_KEY, {
    duration_type: "7hour",
    event_date: "not-a-date",
    items: [],
  });
  assertEquals(r.status, 400, r.body);
  assert(r.json?.error, "expected error field");
});

Deno.test("submit-booking: rejects 7-hour booking when pickup <= delivery", async () => {
  const r = await callFn("submit-booking", ANON_KEY, bookingPayload({
    event_start_time: "17:00",
    event_end_time: "10:00",
  }));
  assertEquals(r.status, 400, r.body);
  assert(/pickup/i.test(r.body), `expected pickup error, got ${r.body}`);
});

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