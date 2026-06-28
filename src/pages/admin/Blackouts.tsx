import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Ban } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Blackout = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
};

export default function AdminBlackouts() {
  const [rows, setRows] = useState<Blackout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("global_blackouts")
      .select("id, start_date, end_date, reason, created_at")
      .order("start_date", { ascending: true });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!start) return toast.error("Pick a start date");
    const endVal = end || start;
    if (endVal < start) return toast.error("End date must be on or after start date");
    setSaving(true);
    const { error } = await supabase.from("global_blackouts").insert({
      start_date: start,
      end_date: endVal,
      reason: reason.trim() || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setStart(""); setEnd(""); setReason("");
    toast.success("Blackout dates added");
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("global_blackouts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Blackout removed");
    setConfirmId(null);
    load();
  }

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Ban className="h-6 w-6 text-destructive" /> Global Blackout Dates
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Block off dates for <strong>every rental product</strong> at once — e.g. holidays, capacity limits, weather closures. Customers won't be able to book any item on these dates.
        </p>
      </div>

      <Card className="p-4 space-y-4">
        <h2 className="font-semibold">Add blackout</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="bo-start">Start date</Label>
            <Input id="bo-start" type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bo-end">End date <span className="text-muted-foreground text-xs">(leave blank for single day)</span></Label>
            <Input id="bo-end" type="date" min={start || today} value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="bo-reason">Reason <span className="text-muted-foreground text-xs">(optional, internal only)</span></Label>
          <Input id="bo-reason" placeholder="e.g. July 4th — drivers at capacity" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <Button onClick={add} disabled={saving || !start}>{saving ? "Saving…" : "Block these dates"}</Button>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-3">Scheduled blackouts</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No global blackouts set.</p>
        ) : (
          <ul className="divide-y border border-border rounded-md">
            {rows.map((r) => {
              const single = r.start_date === r.end_date;
              const past = r.end_date < today;
              return (
                <li key={r.id} className={`p-3 flex items-start justify-between gap-3 ${past ? "opacity-60" : ""}`}>
                  <div className="min-w-0">
                    <div className="font-medium">
                      {single
                        ? format(parseISO(r.start_date), "EEE, MMM d, yyyy")
                        : `${format(parseISO(r.start_date), "MMM d, yyyy")} → ${format(parseISO(r.end_date), "MMM d, yyyy")}`}
                      {past && <span className="ml-2 text-xs text-muted-foreground">(past)</span>}
                    </div>
                    {r.reason && <div className="text-sm text-muted-foreground mt-0.5">{r.reason}</div>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmId(r.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove blackout?</AlertDialogTitle>
            <AlertDialogDescription>
              Customers will be able to book products on these dates again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmId && remove(confirmId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}