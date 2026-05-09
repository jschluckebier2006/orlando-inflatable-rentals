import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, Mail, RefreshCw, Search } from "lucide-react";

interface LogRow {
  id: string;
  created_at: string;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  related_booking_id: string | null;
  resend_message_id: string | null;
}

const RESCHEDULE_TEMPLATES = ["booking_reschedule_customer", "booking_reschedule_admin"];

export default function Notifications() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scope, setScope] = useState<"reschedule" | "all">("reschedule");

  async function load() {
    setLoading(true);
    let q = (supabase.from("email_send_log") as any)
      .select("id,created_at,template_name,recipient_email,status,error_message,related_booking_id,resend_message_id")
      .order("created_at", { ascending: false })
      .limit(200);
    if (scope === "reschedule") q = q.in("template_name", RESCHEDULE_TEMPLATES);
    const { data } = await q;
    setRows((data ?? []) as LogRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [scope]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !r.recipient_email.toLowerCase().includes(s) &&
          !r.template_name.toLowerCase().includes(s) &&
          !(r.related_booking_id ?? "").toLowerCase().includes(s)
        ) return false;
      }
      return true;
    });
  }, [rows, statusFilter, search]);

  const stats = useMemo(() => {
    const s = { total: filtered.length, sent: 0, failed: 0 };
    filtered.forEach((r) => {
      if (r.status === "sent") s.sent++;
      else if (r.status === "failed" || r.status === "dlq") s.failed++;
    });
    return s;
  }, [filtered]);

  const friendlyTemplate = (t: string) =>
    t === "booking_reschedule_customer" ? "Reschedule → Customer"
    : t === "booking_reschedule_admin" ? "Reschedule → Admin"
    : t.replace(/_/g, " ");

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" /> Notification log
          </h1>
          <p className="text-sm text-muted-foreground">Email delivery status for reschedules and other admin notifications.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

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
        <Select value={scope} onValueChange={(v) => setScope(v as any)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="reschedule">Reschedules only</SelectItem>
            <SelectItem value="all">All notifications</SelectItem>
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
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No notifications match these filters.</div>
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
                      <span className="font-medium text-sm">{friendlyTemplate(r.template_name)}</span>
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

      <p className="text-xs text-muted-foreground">
        SMS notifications will appear here once Twilio is connected.
      </p>
    </div>
  );
}