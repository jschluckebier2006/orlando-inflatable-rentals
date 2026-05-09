// Sends a test render of an email template to the requesting admin.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { sendEmail, loadTemplate, applyMergeTags } from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function layout(body: string, preheader = "Test email from Orlando Inflatables admin") {
  return `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;">
<span style="display:none">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:24px 12px;">
<tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#1e88ff;padding:20px 28px;color:#fff;font-size:20px;font-weight:bold;">Orlando Inflatables · TEST</td></tr>
<tr><td style="padding:28px;">${body}</td></tr></table></td></tr></table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const sbAuth = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData } = await sbAuth.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const sbAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roleRow } = await sbAdmin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { template_key, recipient, sample_data } = await req.json();
    if (!template_key || typeof template_key !== "string") {
      return new Response(JSON.stringify({ error: "template_key required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const to = (typeof recipient === "string" && recipient) ? recipient : (user.email ?? "");
    if (!to) {
      return new Response(JSON.stringify({ error: "no recipient" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const tpl = await loadTemplate(template_key);
    if (!tpl) {
      return new Response(JSON.stringify({ error: "template not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data: Record<string, string> = {
      first_name: "Sample",
      customer_name: "Sample Customer",
      customer_email: "sample@example.com",
      customer_phone: "(407) 555-1234",
      ref: "TEST1234",
      event_date: "Saturday, June 14, 2025",
      phone: "(407) 497-1840",
      total: "$329.00",
      paid: "$50.00",
      balance: "$279.00",
      cart_total: "$329.00",
      review_url: "https://g.page/r/orlando-inflatables/review",
      old_dates: "Sat, June 7, 2025",
      new_dates: "Sat, June 14, 2025",
      actor_email: user.email ?? "admin",
      override_block: "",
      override_emoji: "",
      details_block: '<p style="font-size:13px;color:#666;">[event details would render here]</p>',
      items_block: '<p style="font-size:13px;color:#666;">[items table would render here]</p>',
      items_list: '<p style="font-size:13px;color:#666;">[items list would render here]</p>',
      totals_block: '<p style="font-size:13px;color:#666;">[totals breakdown would render here]</p>',
      reschedule_block: '<p style="font-size:13px;color:#666;">[reschedule details would render here]</p>',
      notes_block: "",
      stripe_block: "",
      ...(sample_data && typeof sample_data === "object" ? sample_data : {}),
    };
    const subject = "[TEST] " + applyMergeTags(tpl.subject, data);
    const innerHtml = applyMergeTags(tpl.body_html, data);
    const html = layout(innerHtml);

    const r = await sendEmail({
      to,
      subject,
      html,
      from: "alerts",
      templateName: `test:${template_key}`,
      idempotencyKey: `test:${template_key}:${user.id}:${Date.now()}`,
    });
    return new Response(JSON.stringify(r), {
      status: r.ok ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-test-email", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});