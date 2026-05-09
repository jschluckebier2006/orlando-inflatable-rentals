import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/adminActivity";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { eachDayOfInterval, parseISO, format } from "date-fns";
import { products as INVENTORY } from "@/data/inventory";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  bookingId: string;
  currentStart: string;
  currentEnd: string;
  productIds: string[];
  onRescheduled?: () => void;
}

interface ConflictRow {
  product_id: string;
  event_date: string;
}

export function RescheduleDialog({ open, onOpenChange, bookingId, currentStart, currentEnd, productIds, onRescheduled }: Props) {
  const { toast } = useToast();
  const [start, setStart] = useState(currentStart);
  const [end, setEnd] = useState(currentEnd);
  const [conflicts, setConflicts] = useState<ConflictRow[]>([]);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [override, setOverride] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (open) {
      setStart(currentStart);
      setEnd(currentEnd || currentStart);
      setConflicts([]);
      setOverride(false);
      setChecked(false);
    }
  }, [open, currentStart, currentEnd]);

  async function checkConflicts(): Promise<ConflictRow[]> {
    if (!productIds.length || !start) { setChecked(true); return []; }
    setChecking(true);
    const { data } = await (supabase.rpc as any)("get_booked_dates_for_products", { _product_ids: productIds });
    setChecking(false);
    const rangeKeys = new Set(
      eachDayOfInterval({ start: parseISO(start), end: parseISO(end || start) }).map((d) => format(d, "yyyy-MM-dd")),
    );
    const currentRange = new Set(
      eachDayOfInterval({ start: parseISO(currentStart), end: parseISO(currentEnd || currentStart) }).map((d) => format(d, "yyyy-MM-dd")),
    );
    const list = ((data ?? []) as ConflictRow[]).filter((r) => {
      if (currentRange.has(r.event_date)) return false; // ignore self/current dates
      return productIds.includes(r.product_id) && rangeKeys.has(r.event_date);
    });
    setChecked(true);
    setConflicts(list);
    return list;
  }

  // Auto-check when dates change
  useEffect(() => {
    if (!open) return;
    setChecked(false);
    setConflicts([]);
    setOverride(false);
    const t = setTimeout(() => { checkConflicts(); }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, open]);

  function productName(id: string) {
    return INVENTORY.find((p) => p.id === id)?.name ?? id;
  }

  // Group conflicts by product for clearer display
  const grouped = conflicts.reduce<Record<string, string[]>>((acc, c) => {
    (acc[c.product_id] ||= []).push(c.event_date);
    return acc;
  }, {});

  async function attemptSave(force: boolean) {
    if (!start) return;
    if (!force && conflicts.length > 0) return;
    setSaving(true);
    const { error } = await (supabase.from("bookings") as any)
      .update({ event_date: start, event_end_date: end || start })
      .eq("id", bookingId);
    if (error) {
      setSaving(false);
      toast({ title: "Reschedule failed", description: error.message, variant: "destructive" });
      return;
    }
    await logActivity({
      bookingId,
      kind: "date_change",
      message: `Rescheduled from ${currentStart}${currentEnd && currentEnd !== currentStart ? `→${currentEnd}` : ""} to ${start}${end && end !== start ? `→${end}` : ""}${force ? " (override: conflicts ignored)" : ""}.`,
      metadata: { from_start: currentStart, from_end: currentEnd, to_start: start, to_end: end, override: force },
    });
    // Fire customer + admin notification email (non-blocking)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.functions.invoke("send-reschedule-email", {
        body: {
          booking_id: bookingId,
          previous_start: currentStart,
          previous_end: currentEnd || currentStart,
          override: force,
          actor_email: user?.email ?? null,
        },
      });
    } catch (e) {
      console.warn("send-reschedule-email failed", e);
    }
    setSaving(false);
    toast({ title: "Booking rescheduled", description: "Customer has been emailed the new date." });
    onOpenChange(false);
    onRescheduled?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit date</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>New start date</Label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <Label>New end date</Label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          {checking && (
            <p className="text-xs text-muted-foreground">Checking availability…</p>
          )}
          {!checking && checked && conflicts.length === 0 && start && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 rounded-md border border-emerald-200 bg-emerald-50 p-2">
              <CheckCircle2 className="h-4 w-4" /> All items available for the selected range.
            </div>
          )}
          {conflicts.length > 0 && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" /> Unavailable — {conflicts.length} conflict{conflicts.length > 1 ? "s" : ""}
              </div>
              <p className="text-sm">These items are already booked on the dates below:</p>
              <ul className="text-xs space-y-1.5 max-h-48 overflow-y-auto">
                {Object.entries(grouped).map(([pid, dates]) => (
                  <li key={pid} className="border-l-2 border-destructive/50 pl-2">
                    <div className="font-medium">{productName(pid)}</div>
                    <div className="text-muted-foreground">
                      {dates.sort().map((d) => format(parseISO(d), "EEE, MMM d")).join(" · ")}
                    </div>
                  </li>
                ))}
              </ul>
              <label className="flex items-start gap-2 pt-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={override}
                  onChange={(e) => setOverride(e.target.checked)}
                  className="mt-0.5"
                />
                <span>I understand this will double-book the items above. Override and save anyway.</span>
              </label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {conflicts.length > 0 ? (
            <Button variant="destructive" onClick={() => attemptSave(true)} disabled={saving || !override}>
              {saving ? "Saving…" : "Override and save"}
            </Button>
          ) : (
            <Button onClick={() => attemptSave(false)} disabled={saving || checking || !checked}>
              {checking ? "Checking…" : saving ? "Saving…" : "Save new date"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
