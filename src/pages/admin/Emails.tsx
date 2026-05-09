import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, History, Mail, RefreshCw, Save, Search, Send, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateRow {
  key: string;
  label: string;
  description: string | null;
  subject: string;
  body_html: string;
  enabled: boolean;
  use_custom: boolean;
  updated_at: string;
  updated_by: string | null;
}

interface VersionRow {
  id: string;
  template_key: string;
  subject: string;
  body_html: string;
  saved_by: string | null;
  created_at: string;
}

interface LogRow {
  id: string;
  created_at: string;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  related_booking_id: string | null;
}

const SAMPLE_DATA: Record<string, string> = {
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
  actor_email: "admin@orlandoinflatables.com",
  override_block: "",
  override_emoji: "",
  details_block: '<p style="font-size:13px;color:#666;font-style:italic;">[event details table will render here]</p>',
  items_block: '<p style="font-size:13px;color:#666;font-style:italic;">[items table will render here]</p>',
  items_list: '<p style="font-size:13px;color:#666;font-style:italic;">[items list will render here]</p>',
  totals_block: '<p style="font-size:13px;color:#666;font-style:italic;">[totals breakdown will render here]</p>',
  reschedule_block: '<p style="font-size:13px;color:#666;font-style:italic;">[reschedule details will render here]</p>',
  notes_block: "",
  stripe_block: "",
};

function applyMerge(s: string): string {
  return String(s ?? "").replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => SAMPLE_DATA[k] ?? "");
}

function previewHtml(bodyHtml: string): string {
  const inner = applyMerge(bodyHtml);
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:24px 12px;">
<tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
<tr><td style="background:#1e88ff;padding:20px 28px;color:#fff;font-size:20px;font-weight:bold;">Orlando Inflatables</td></tr>
<tr><td style="padding:28px;">${inner}</td></tr>
<tr><td style="background:#f4f6fa;padding:18px 28px;font-size:13px;color:#54657a;">
Questions? Call <a href="tel:+14074971840" style="color:#1e88ff;font-weight:bold;text-decoration:none;">(407) 497-1840</a><br>
<a href="https://orlandoinflatables.com" style="color:#1e88ff;">orlandoinflatables.com</a>
</td></tr></table></td></tr></table></body></html>`;
}

const MERGE_TAGS_BY_TEMPLATE: Record<string, string[]> = {
  booking_confirmation_customer: ["first_name", "ref", "event_date", "phone", "details_block", "items_block", "totals_block"],
  booking_new_admin: ["ref", "customer_name", "customer_email", "customer_phone", "event_date", "details_block", "items_list", "total", "paid", "balance", "notes_block", "stripe_block"],
  booking_reschedule_customer: ["first_name", "ref", "event_date", "phone", "reschedule_block"],
  booking_reschedule_admin: ["ref", "customer_name", "customer_email", "customer_phone", "event_date", "old_dates", "new_dates", "actor_email", "override_block", "override_emoji"],
  abandoned_cart_admin: ["customer_name", "customer_email", "customer_phone", "event_date", "items_list", "cart_total"],
  day_before_reminder: ["first_name", "event_date", "phone", "details_block"],
  post_event_review: ["first_name", "review_url"],
};

function TemplatesTab() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ subject: string; body_html: string; enabled: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [testRecipient, setTestRecipient] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await (supabase.from("email_templates") as any).select("*").order("label");
    const list = (data ?? []) as TemplateRow[];
    setTemplates(list);
    if (list.length && !activeKey) setActiveKey(list[0].key);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const active = templates.find((t) => t.key === activeKey) ?? null;

  useEffect(() => {
    if (active) setDraft({ subject: active.subject, body_html: active.body_html, enabled: active.enabled });
    setShowVersions(false);
  }, [activeKey, active?.updated_at]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) setTestRecipient(session.user.email);
    })();
  }, []);

  async function handleSave() {
    if (!active || !draft) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    const actor = session?.user?.email ?? null;
    // Snapshot previous version
    await (supabase.from("email_template_versions") as any).insert({
      template_key: active.key,
      subject: active.subject,
      body_html: active.body_html,
      saved_by: actor,
    });
    const { error } = await (supabase.from("email_templates") as any)
      .update({
        subject: draft.subject,
        body_html: draft.body_html,
        enabled: draft.enabled,
        use_custom: true,
        updated_at: new Date().toISOString(),
        updated_by: actor,
      })
      .eq("key", active.key);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Template saved", description: `${active.label} updated.` });
    load();
  }

  async function handleSendTest() {
    if (!active || !draft) return;
    if (!testRecipient) {
      toast({ title: "Add a recipient", description: "Enter an email address to receive the test.", variant: "destructive" });
      return;
    }
    // Save first so the test reflects current draft
    if (draft.subject !== active.subject || draft.body_html !== active.body_html || draft.enabled !== active.enabled) {
      await handleSave();
    }
    const { data, error } = await supabase.functions.invoke("send-test-email", {
      body: { template_key: active.key, recipient: testRecipient },
    });
    if (error || (data as any)?.error) {
      toast({ title: "Test send failed", description: error?.message ?? (data as any)?.error ?? "Unknown error", variant: "destructive" });
      return;
    }
    toast({ title: "Test sent", description: `Check ${testRecipient}.` });
  }

  async function loadVersions() {
    if (!active) return;
    const { data } = await (supabase.from("email_template_versions") as any)
      .select("*").eq("template_key", active.key).order("created_at", { ascending: false }).limit(20);
    setVersions((data ?? []) as VersionRow[]);
    setShowVersions(true);
  }

  async function rollback(v: VersionRow) {
    if (!confirm("Roll back to this version? Current draft will be lost.")) return;
    setDraft({ subject: v.subject, body_html: v.body_html, enabled: draft?.enabled ?? true });
    setShowVersions(false);
    toast({ title: "Loaded version", description: "Click Save to apply this version." });
  }

  const tags = active ? (MERGE_TAGS_BY_TEMPLATE[active.key] ?? []) : [];

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground text-sm">Loading templates…</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-4">
      <Card className="p-2 h-fit">
        <div className="text-xs uppercase font-semibold text-muted-foreground px-2 py-1.5">Templates</div>
        <div className="space-y-0.5">
          {templates.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveKey(t.key)}
              className={`w-full text-left px-2 py-2 rounded text-sm transition-colors ${
                activeKey === t.key ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate">{t.label}</span>
                {!t.enabled && <Badge variant="outline" className="text-[10px] shrink-0">Off</Badge>}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {!active || !draft ? (
        <Card className="p-8 text-center text-muted-foreground">Select a template</Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-display font-bold text-lg">{active.label}</h2>
                {active.description && <p className="text-sm text-muted-foreground mt-0.5">{active.description}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Last edited {format(new Date(active.updated_at), "MMM d, yyyy h:mm a")}
                  {active.updated_by ? ` by ${active.updated_by}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="enabled-toggle" className="text-sm">Enabled</Label>
                <Switch
                  id="enabled-toggle"
                  checked={draft.enabled}
                  onCheckedChange={(v) => setDraft({ ...draft, enabled: v })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subj">Subject line</Label>
              <Input
                id="subj"
                value={draft.subject}
                onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="body">Body (HTML)</Label>
                <div className="flex flex-wrap gap-1 max-w-[60%] justify-end">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setDraft({ ...draft, body_html: draft.body_html + `{{${tag}}}` })}
                      className="text-[10px] px-1.5 py-0.5 bg-muted hover:bg-muted-foreground/20 rounded font-mono"
                      title={`Insert {{${tag}}}`}
                    >
                      {`{{${tag}}}`}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                id="body"
                value={draft.body_html}
                onChange={(e) => setDraft({ ...draft, body_html: e.target.value })}
                rows={16}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Use <code>{`{{merge_tag}}`}</code> placeholders. Header & footer chrome (logo bar, phone link) are added automatically.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center pt-2 border-t">
              <Button onClick={handleSave} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-1" /> {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button onClick={loadVersions} variant="outline" size="sm">
                <History className="h-4 w-4 mr-1" /> Version history
              </Button>
              <div className="flex-1" />
              <Input
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="test@example.com"
                className="w-56"
              />
              <Button onClick={handleSendTest} variant="secondary" size="sm">
                <Send className="h-4 w-4 mr-1" /> Send test
              </Button>
            </div>
          </Card>

          {showVersions && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Recent versions</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowVersions(false)}>Close</Button>
              </div>
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved versions yet.</p>
              ) : (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div key={v.id} className="flex items-start justify-between border rounded p-2 text-xs">
                      <div className="min-w-0">
                        <div className="font-medium">{format(new Date(v.created_at), "MMM d, yyyy h:mm a")}</div>
                        <div className="text-muted-foreground">{v.saved_by ?? "—"}</div>
                        <div className="truncate mt-1">Subject: {v.subject}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => rollback(v)}>Load</Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-2 border-b bg-muted/30 flex items-center gap-2">
              <Eye className="h-4 w-4" /> <span className="text-sm font-medium">Live preview</span>
              <span className="text-xs text-muted-foreground">— sample data substituted</span>
            </div>
            <iframe
              title="Email preview"
              srcDoc={previewHtml(draft.body_html)}
              sandbox=""
              className="w-full"
              style={{ height: 600, border: 0, background: "#f4f6fa" }}
            />
            <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
              <strong>Subject preview:</strong> {applyMerge(draft.subject)}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function LogsTab() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");

  async function load() {
    setLoading(true);
    const { data } = await (supabase.from("email_send_log") as any)
      .select("id,created_at,template_name,recipient_email,status,error_message,related_booking_id")
      .order("created_at", { ascending: false })
      .limit(300);
    setRows((data ?? []) as LogRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const templateNames = useMemo(
    () => Array.from(new Set(rows.map((r) => r.template_name))).sort(),
    [rows],
  );

  const filtered = useMemo(() => rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (templateFilter !== "all" && r.template_name !== templateFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!r.recipient_email.toLowerCase().includes(s) &&
          !r.template_name.toLowerCase().includes(s) &&
          !(r.related_booking_id ?? "").toLowerCase().includes(s)) return false;
    }
    return true;
  }), [rows, statusFilter, templateFilter, search]);

  const stats = useMemo(() => {
    const s = { total: filtered.length, sent: 0, failed: 0 };
    filtered.forEach((r) => {
      if (r.status === "sent") s.sent++;
      else if (r.status === "failed" || r.status === "dlq") s.failed++;
    });
    return s;
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total</div><div className="text-2xl font-bold">{stats.total}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-emerald-600">{stats.sent}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Failed</div><div className="text-2xl font-bold text-destructive">{stats.failed}</div></Card>
      </div>
      <Card className="p-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search recipient, template, booking ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={templateFilter} onValueChange={setTemplateFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All templates</SelectItem>
            {templateNames.map((t) => (<SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </Card>
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No emails match these filters.</div>
        ) : (
          <div className="divide-y">
            {filtered.map((r) => {
              const failed = r.status === "failed" || r.status === "dlq";
              return (
                <div key={r.id} className="p-3 flex items-start gap-3">
                  <div className="mt-0.5">
                    {failed ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{r.template_name.replace(/_/g, " ")}</span>
                      <Badge variant={failed ? "destructive" : "secondary"} className="text-xs">{r.status}</Badge>
                      {r.related_booking_id && (
                        <Link to={`/admin/bookings?focus=${r.related_booking_id}`} className="text-xs text-primary hover:underline">
                          #{r.related_booking_id.slice(0, 8).toUpperCase()}
                        </Link>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">→ {r.recipient_email}</div>
                    {r.error_message && (
                      <div className="text-xs text-destructive mt-1 break-words">{r.error_message}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(r.created_at), "MMM d, h:mm a")}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function SchedulesTab() {
  const schedules = [
    { name: "Day-before reminder", template: "day_before_reminder", trigger: "Daily at 4 PM ET — for events the next day" },
    { name: "Post-event review request", template: "post_event_review", trigger: "Daily at 10 AM ET — for events that finished yesterday" },
    { name: "Abandoned cart alert", template: "abandoned_cart_admin", trigger: "Every 15 min — for checkouts started 30+ min ago without payment" },
    { name: "Booking confirmation", template: "booking_confirmation_customer", trigger: "Immediate — when a payment is captured" },
    { name: "New booking alert", template: "booking_new_admin", trigger: "Immediate — when a payment is captured" },
    { name: "Reschedule notification", template: "booking_reschedule_customer", trigger: "Immediate — when an admin changes the event date" },
    { name: "Reschedule alert", template: "booking_reschedule_admin", trigger: "Immediate — when an admin changes the event date" },
  ];
  return (
    <Card className="divide-y">
      {schedules.map((s) => (
        <div key={s.name} className="p-4 flex items-start justify-between gap-3">
          <div>
            <div className="font-medium text-sm">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.trigger}</div>
            <div className="text-[11px] text-muted-foreground mt-1 font-mono">{s.template}</div>
          </div>
          <Badge variant="outline" className="text-xs">Active</Badge>
        </div>
      ))}
      <div className="p-4 text-xs text-muted-foreground bg-muted/30">
        Schedule timing is hard-coded for now. Editable schedules (e.g. "send reminder 2 days before instead of 1") are on the roadmap.
      </div>
    </Card>
  );
}

export default function Emails() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" /> Emails
        </h1>
        <p className="text-sm text-muted-foreground">Edit the wording of every automated email, send test renders, review delivery history, and see which schedules are active.</p>
      </div>
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Send log</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="mt-4"><TemplatesTab /></TabsContent>
        <TabsContent value="logs" className="mt-4"><LogsTab /></TabsContent>
        <TabsContent value="schedules" className="mt-4"><SchedulesTab /></TabsContent>
      </Tabs>
    </div>
  );
}