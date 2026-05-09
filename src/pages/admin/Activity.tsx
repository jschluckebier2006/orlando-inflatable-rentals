import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

const ACTION_LABELS: Record<string, string> = {
  "image.promote_primary": "Promote primary image",
  "image.clear_primary": "Clear primary image",
};

function SystemAuditFeed() {
  const [entries, setEntries] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from("admin_audit_log") as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setEntries((data ?? []) as any[]);
    })();
  }, []);

  // Group bulk entries by batch_id (latest first); single entries pass through.
  const groups: Array<{ key: string; rows: any[]; isBulk: boolean }> = [];
  const seenBatches = new Set<string>();
  for (const e of entries) {
    const batchId = e.metadata?.batch_id;
    if (batchId) {
      if (seenBatches.has(batchId)) continue;
      seenBatches.add(batchId);
      groups.push({ key: batchId, rows: entries.filter((x) => x.metadata?.batch_id === batchId), isBulk: true });
    } else {
      groups.push({ key: e.id, rows: [e], isBulk: false });
    }
  }

  if (entries.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No system activity yet.</p>;
  }

  return (
    <div className="bg-card border border-border rounded-lg divide-y">
      {groups.map((g) => {
        const head = g.rows[0];
        const open = !!expanded[g.key];
        const actionLabel = ACTION_LABELS[head.action] ?? head.action;
        return (
          <div key={g.key} className="p-3">
            <button
              type="button"
              className="w-full text-left flex items-start gap-2"
              onClick={() => setExpanded((m) => ({ ...m, [g.key]: !m[g.key] }))}
            >
              {g.isBulk || (head.before || head.after) ? (
                open ? <ChevronDown className="h-4 w-4 mt-0.5 flex-shrink-0"/> : <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0"/>
              ) : <span className="w-4"/>}
              <div className="flex-1 min-w-0">
                <div className="text-sm flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{actionLabel}</Badge>
                  {g.isBulk ? (
                    <span>{g.rows.length} item{g.rows.length === 1 ? "" : "s"} updated via bulk action</span>
                  ) : (
                    <span className="truncate">{head.summary}</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(head.created_at), "MMM d, yyyy h:mm a")}
                  {head.actor_email ? ` · ${head.actor_email}` : ""}
                </div>
              </div>
            </button>
            {open && (
              <div className="mt-2 pl-6 space-y-2">
                {g.rows.map((r) => (
                  <div key={r.id} className="text-xs border-l-2 border-border pl-3 py-1">
                    <div className="font-medium text-sm">
                      {r.entity_type === "inventory_item" ? (
                        <Link to={`/admin/inventory/${r.entity_id}`} className="text-primary hover:underline">
                          {r.metadata?.item_name ?? r.entity_id}
                        </Link>
                      ) : (
                        <span>{r.summary}</span>
                      )}
                    </div>
                    {(r.before && Object.keys(r.before).length > 0) || (r.after && Object.keys(r.after).length > 0) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <div>
                          <div className="text-muted-foreground mb-0.5">Before</div>
                          <pre className="bg-muted p-2 rounded text-[11px] whitespace-pre-wrap break-all">{JSON.stringify(r.before, null, 2)}</pre>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-0.5">After</div>
                          <pre className="bg-muted p-2 rounded text-[11px] whitespace-pre-wrap break-all">{JSON.stringify(r.after, null, 2)}</pre>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Activity() {
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("booking_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setEntries((data as any) ?? []);
    })();
  }, []);
  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="font-display text-2xl md:text-3xl font-bold">Activity log</h1>
      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="mt-4">
      <div className="bg-card border border-border rounded-lg divide-y">
        {entries.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
        ) : entries.map((e) => (
          <div key={e.id} className="p-3">
            <div className="text-sm">{e.message}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {format(parseISO(e.created_at), "MMM d, yyyy h:mm a")}
              {e.actor_email ? ` · ${e.actor_email}` : ""}
              {e.booking_id && (
                <> · <Link to={`/admin/bookings?open=${e.booking_id}`} className="text-primary hover:underline">View booking</Link></>
              )}
            </div>
          </div>
        ))}
      </div>
        </TabsContent>
        <TabsContent value="system" className="mt-4">
          <SystemAuditFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
}
