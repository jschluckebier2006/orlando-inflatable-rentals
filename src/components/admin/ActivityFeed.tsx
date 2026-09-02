import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { logActivity, type ActivityKind } from "@/lib/adminActivity";
import { format, parseISO } from "date-fns";
import { MessageSquare, ArrowRightLeft, DollarSign, CalendarRange, Mail, Sparkles, Pencil, XCircle, RotateCcw, Archive } from "lucide-react";

interface Entry {
  id: string;
  kind: ActivityKind;
  message: string;
  actor_email: string | null;
  created_at: string;
}

const ICON: Record<ActivityKind, any> = {
  note: MessageSquare,
  status_change: ArrowRightLeft,
  payment: DollarSign,
  date_change: CalendarRange,
  email_sent: Mail,
  created: Sparkles,
  edited: Pencil,
  cancelled: XCircle,
  restored: RotateCcw,
  archived: Archive,
};

export function ActivityFeed({ bookingId, customerId }: { bookingId?: string; customerId?: string }) {
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    let q = supabase.from("booking_activity").select("*").order("created_at", { ascending: false }).limit(100);
    if (bookingId) q = q.eq("booking_id", bookingId);
    if (customerId) q = q.eq("customer_id", customerId);
    const { data } = await q;
    setEntries((data as any) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (bookingId || customerId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, customerId]);

  async function addNote() {
    if (!note.trim()) return;
    setSaving(true);
    await logActivity({
      bookingId: bookingId ?? null,
      customerId: customerId ?? null,
      kind: "note",
      message: note.trim(),
    });
    setNote("");
    setSaving(false);
    await load();
    toast({ title: "Note added" });
  }

  return (
    <div className="space-y-3">
      <div>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (e.g., Called customer, confirmed delivery time)…"
          rows={2}
        />
        <div className="flex justify-end mt-2">
          <Button size="sm" onClick={addNote} disabled={saving || !note.trim()}>
            Add note
          </Button>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => {
            const Icon = ICON[e.kind] ?? MessageSquare;
            return (
              <li key={e.id} className="border border-border rounded-md p-3 bg-background">
                <div className="flex items-start gap-2">
                  <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm whitespace-pre-wrap break-words">{e.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(parseISO(e.created_at), "MMM d, yyyy h:mm a")}
                      {e.actor_email ? ` · ${e.actor_email}` : ""}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
