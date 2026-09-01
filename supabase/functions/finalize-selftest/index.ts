// TEMPORARY verification harness for the atomic finalize path.
// Guarded by the reconciliation cron secret. Deleted after the Pass 2 check.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { finalizeBookingFromSession } from "../_shared/finalizeBooking.ts";

Deno.serve(async (req) => {
  const secret = Deno.env.get("RECONCILE_CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return new Response("unauthorized", { status: 401 });
  }
  const { session } = await req.json();
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const result = await finalizeBookingFromSession(sb, session);
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
