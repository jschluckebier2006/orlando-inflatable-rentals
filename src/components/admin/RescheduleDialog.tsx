import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/adminActivity";
import { AlertTriangle } from "lucide-react";
import { eachDayOfInterval, parseISO, format } from "date-fns";

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

  useEffect(() => {
    if (open) {
      setStart(currentStart);
      setEnd(currentEnd || currentStart);
      setConflicts([]);
    }
  }, [open, currentStart, currentEnd]);

  async function checkConflicts(): Promise<ConflictRow[]> {
    if (!productIds.length) return [];
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
    return list;
  }

  async function attemptSave(force: boolean) {
    if (!start) return;
    if (!force) {
      const c = await checkConflicts();
      if (c.length > 0) {
        setConflicts(c);
        return;
      }
    }
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
    setSaving(false);
    toast({ title: "Booking rescheduled" });
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
            <Input type="date" value={start} onChange={(e) => { setStart(e.target.value); setConflicts([]); }} />
          </div>
          <div>
            <Label>New end date</Label>
            <Input type="date" value={end} onChange={(e) => { setEnd(e.target.value); setConflicts([]); }} />
          </div>
          {conflicts.length > 0 && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" /> Conflict detected
              </div>
              <p className="text-sm">
                The following items are already booked in the new date range:
              </p>
              <ul className="text-xs list-disc list-inside">
                {conflicts.slice(0, 8).map((c, i) => (
                  <li key={i}>{c.product_id} on {c.event_date}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                You can override and save anyway, but the same item will be double-booked.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {conflicts.length > 0 ? (
            <Button variant="destructive" onClick={() => attemptSave(true)} disabled={saving}>
              Override and save
            </Button>
          ) : (
            <Button onClick={() => attemptSave(false)} disabled={saving || checking}>
              {checking ? "Checking…" : saving ? "Saving…" : "Save new date"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
