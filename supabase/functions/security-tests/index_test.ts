import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("VITE_SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function rpc(fn: string, key: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: headers(key),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function rest(path: string, key: string, init: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers(key), ...(init.headers as Record<string, string> ?? {}) },
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

const cleanupBookingIds: string[] = [];

function bookingPayload(extra: Record<string, unknown> = {}) {
  return {
    customer_name: "SecTest User",
    customer_email: "sectest@example.com",
    customer_phone: "555-0000",
    event_address_line: "1 Test St",
    event_city: "Orlando",
    event_zip: "32801",
    event_date: "2099-01-01",
    event_end_date: "2099-01-01",
    notes: "security-test-row",
    ...extra,
  };
}

// ---------- get_booked_dates RPC permissions ----------

Deno.test("anon CAN execute get_booked_dates", async () => {
  const r = await rpc("get_booked_dates", ANON_KEY, { _product_id: "nonexistent" });
  assertEquals(r.status, 200, r.body);
});

Deno.test("anon CAN execute get_booked_dates_for_products", async () => {
  const r = await rpc("get_booked_dates_for_products", ANON_KEY, {
    _product_ids: ["nonexistent"],
  });
  assertEquals(r.status, 200, r.body);
});

Deno.test("service_role CAN execute get_booked_dates", async () => {
  const r = await rpc("get_booked_dates", SERVICE_KEY, { _product_id: "nonexistent" });
  assertEquals(r.status, 200, r.body);
});

// ---------- has_role RPC permissions ----------

Deno.test("anon CANNOT execute has_role (revoked)", async () => {
  const r = await rpc("has_role", ANON_KEY, {
    _user_id: "00000000-0000-0000-0000-000000000000",
    _role: "admin",
  });
  // PostgREST returns 404 when function not found for role, or 403 when denied.
  assert(
    r.status === 403 || r.status === 404 || r.status === 401,
    `expected anon to be denied has_role, got ${r.status}: ${r.body}`,
  );
});

Deno.test("service_role CAN execute has_role", async () => {
  const r = await rpc("has_role", SERVICE_KEY, {
    _user_id: "00000000-0000-0000-0000-000000000000",
    _role: "admin",
  });
  assertEquals(r.status, 200, r.body);
});

// ---------- bookings INSERT RLS ----------

Deno.test("anon CAN insert into bookings (guest checkout — RLS WITH CHECK true; no return)", async () => {
  // Note: cannot use Prefer: return=representation as anon (no SELECT policy on bookings).
  const r = await rest("bookings", ANON_KEY, {
    method: "POST",
    body: JSON.stringify(bookingPayload()),
  });
  assertEquals(r.status, 201, r.body);
});

Deno.test("anon CANNOT select from bookings", async () => {
  const r = await rest("bookings?select=id&limit=1", ANON_KEY);
  // RLS with no SELECT policy returns 200 with empty array, not an error.
  // Verify no rows leak.
  assertEquals(r.status, 200, r.body);
  assertEquals(JSON.parse(r.body).length, 0);
});

Deno.test("service_role CAN insert and select bookings", async () => {
  const ins = await rest("bookings", SERVICE_KEY, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(bookingPayload()),
  });
  assertEquals(ins.status, 201, ins.body);
  const row = JSON.parse(ins.body)[0];
  cleanupBookingIds.push(row.id);

  const sel = await rest(`bookings?id=eq.${row.id}&select=id`, SERVICE_KEY);
  assertEquals(sel.status, 200, sel.body);
  assert(JSON.parse(sel.body).length === 1);
});

// ---------- booking_items INSERT RLS ----------

Deno.test("anon CAN insert booking_items via REST (RLS WITH CHECK true; protected by trigger + edge-function-only flow)", async () => {
  // Create a parent booking as service role.
  const b = await rest("bookings", SERVICE_KEY, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(bookingPayload({ product_id: "test-item-parent" })),
  });
  assertEquals(b.status, 201, b.body);
  const bookingId = JSON.parse(b.body)[0].id;
  cleanupBookingIds.push(bookingId);

  const r = await rest("booking_items", ANON_KEY, {
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
      product_id: `sectest-${crypto.randomUUID()}`,
      product_name: "Security Test Item",
      product_price: 1,
      unit_price: 1,
    }),
  });
  assertEquals(r.status, 201, r.body);
});

Deno.test("service_role CAN insert booking_items (edge function path)", async () => {
  const b = await rest("bookings", SERVICE_KEY, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(bookingPayload()),
  });
  assertEquals(b.status, 201, b.body);
  const bookingId = JSON.parse(b.body)[0].id;
  cleanupBookingIds.push(bookingId);

  const r = await rest("booking_items", SERVICE_KEY, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      booking_id: bookingId,
      product_id: `sectest-${crypto.randomUUID()}`,
      product_name: "Security Test Item",
      product_price: 1,
      unit_price: 1,
    }),
  });
  assertEquals(r.status, 201, r.body);
});

Deno.test("anon CANNOT select from booking_items", async () => {
  const r = await rest("booking_items?select=id&limit=1", ANON_KEY);
  assertEquals(r.status, 200, r.body);
  assertEquals(JSON.parse(r.body).length, 0);
});

// ---------- pending_bookings deny-all ----------

Deno.test("anon CANNOT select pending_bookings", async () => {
  const r = await rest("pending_bookings?select=id&limit=1", ANON_KEY);
  assertEquals(r.status, 200, r.body);
  assertEquals(JSON.parse(r.body).length, 0);
});

Deno.test("anon CANNOT insert into pending_bookings", async () => {
  const r = await rest("pending_bookings", ANON_KEY, {
    method: "POST",
    body: JSON.stringify({
      stripe_session_id: `sectest-${crypto.randomUUID()}`,
      amount_total: 1,
      deposit_amount: 1,
      amount_charged: 1,
      payload: {},
    }),
  });
  // RLS WITH CHECK false → 403 / 401
  assert(r.status >= 400, `expected denial, got ${r.status}: ${r.body}`);
});

Deno.test("service_role CAN insert and read pending_bookings", async () => {
  const sid = `sectest-${crypto.randomUUID()}`;
  const ins = await rest("pending_bookings", SERVICE_KEY, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      stripe_session_id: sid,
      amount_total: 1,
      deposit_amount: 1,
      amount_charged: 1,
      payload: {},
    }),
  });
  assertEquals(ins.status, 201, ins.body);

  const sel = await rest(
    `pending_bookings?stripe_session_id=eq.${sid}&select=id`,
    SERVICE_KEY,
  );
  assertEquals(sel.status, 200, sel.body);
  assertEquals(JSON.parse(sel.body).length, 1);

  // Cleanup
  await rest(`pending_bookings?stripe_session_id=eq.${sid}`, SERVICE_KEY, {
    method: "DELETE",
  });
});

// ---------- Cleanup ----------

Deno.test("zz cleanup test rows", async () => {
  for (const id of cleanupBookingIds) {
    await rest(`booking_items?booking_id=eq.${id}`, SERVICE_KEY, { method: "DELETE" });
    await rest(`bookings?id=eq.${id}`, SERVICE_KEY, { method: "DELETE" });
  }
  // Sweep any anon-created test rows by marker.
  await rest(`bookings?notes=eq.security-test-row`, SERVICE_KEY, { method: "DELETE" });
});