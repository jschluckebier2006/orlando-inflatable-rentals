import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const EVENT_TYPES = [
  "Birthday Party", "School Event", "Church Event",
  "Corporate Event", "Graduation", "Community Event", "Other",
];

// 8:00 AM through 8:00 PM in 30-min increments
function buildTimeSlots() {
  const slots: { value: string; label: string }[] = [];
  for (let h = 8; h <= 20; h++) {
    for (const m of [0, 30]) {
      if (h === 20 && m > 0) continue;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const hour12 = ((h + 11) % 12) + 1;
      const ampm = h < 12 ? "AM" : "PM";
      slots.push({ value, label: `${hour12}:${String(m).padStart(2, "0")} ${ampm}` });
    }
  }
  return slots;
}
const TIME_SLOTS = buildTimeSlots();
const toDateString = (d: Date) => format(d, "yyyy-MM-dd");

export function CheckoutModal() {
  const { toast } = useToast();
  const { items, total, removeItem, clear, isCheckoutOpen, setCheckoutOpen } = useCart();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>();
  const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({}); // product_id -> dates
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    event_address_line: "", event_city: "", event_zip: "",
    event_start_time: "", event_end_time: "",
    event_type: "", notes: "",
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setConfirmedId(null);
      setDate(undefined);
    }
  }, [isCheckoutOpen]);

  // Load booked dates for all cart items
  useEffect(() => {
    if (!isCheckoutOpen || items.length === 0) {
      setBookedMap({});
      return;
    }
    let cancelled = false;
    (async () => {
      const ids = items.map((i) => i.id);
      const { data, error } = await supabase.rpc("get_booked_dates_for_products", { _product_ids: ids });
      if (cancelled) return;
      if (error) {
        console.error("get_booked_dates_for_products failed", error);
        setBookedMap({});
        return;
      }
      const map: Record<string, string[]> = {};
      (data ?? []).forEach((r: { product_id: string; event_date: string }) => {
        (map[r.product_id] ||= []).push(r.event_date);
      });
      setBookedMap(map);
    })();
    return () => { cancelled = true; };
  }, [isCheckoutOpen, items]);

  // A date is disabled if ANY cart item is booked that day
  const allBlockedDates = useMemo(() => {
    const set = new Set<string>();
    Object.values(bookedMap).forEach((arr) => arr.forEach((d) => set.add(d)));
    return set;
  }, [bookedMap]);

  const isDateDisabled = (d: Date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (d < today) return true;
    return allBlockedDates.has(toDateString(d));
  };

  const conflictingItems = useMemo(() => {
    if (!date) return [];
    const ds = toDateString(date);
    return items.filter((i) => (bookedMap[i.id] ?? []).includes(ds));
  }, [date, items, bookedMap]);

  const canContinueStep1 = !!date && items.length > 0 && conflictingItems.length === 0;
  const canContinueStep2 =
    !!form.event_start_time && !!form.event_end_time &&
    form.event_end_time > form.event_start_time;
  const canSubmit =
    form.customer_name.trim() && form.customer_email.trim() && form.customer_phone.trim() &&
    form.event_address_line.trim() && form.event_city.trim() && form.event_zip.trim();

  async function handleSubmit() {
    if (!date || items.length === 0) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-booking", {
        body: {
          event_date: toDateString(date),
          event_start_time: form.event_start_time,
          event_end_time: form.event_end_time,
          event_type: form.event_type || null,
          customer_name: form.customer_name.trim(),
          customer_email: form.customer_email.trim(),
          customer_phone: form.customer_phone.trim(),
          event_address_line: form.event_address_line.trim(),
          event_city: form.event_city.trim(),
          event_zip: form.event_zip.trim(),
          notes: form.notes.trim() || null,
          items: items.map((i) => ({
            product_id: i.id, product_name: i.name, product_price: i.price,
          })),
        },
      });
      if (error) {
        const ctx: any = (error as any).context;
        let msg = "Could not submit your booking. Please try again.";
        if (ctx?.json?.error) msg = ctx.json.error;
        else if (typeof ctx?.body === "string") {
          try { msg = JSON.parse(ctx.body).error ?? msg; } catch {}
        }
        toast({ title: "Booking failed", description: msg, variant: "destructive" });
        return;
      }
      setConfirmedId(data.id);
      clear();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {confirmedId ? "Reservation Received!" : "Reserve Your Rentals"}
          </DialogTitle>
          <DialogDescription>
            {confirmedId
              ? "We'll confirm by phone or email shortly."
              : "Pick your date and times, then enter your event details."}
          </DialogDescription>
        </DialogHeader>

        {confirmedId ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <p className="text-foreground">
              Reference: <span className="font-mono font-semibold">{confirmedId.slice(0, 8)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              We've reserved your rentals for{" "}
              <strong>{date && format(date, "EEEE, MMMM d, yyyy")}</strong>. Our team will reach out at{" "}
              <strong>{form.customer_phone}</strong> to finalize details.
            </p>
            <Button onClick={() => setCheckoutOpen(false)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Close
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Your cart is empty. Add some rentals first.
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <div className="rounded-md bg-muted/40 p-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">Items in your cart ({items.length})</p>
              <ul className="space-y-1 text-sm">
                {items.map((i) => {
                  const conflict = date && (bookedMap[i.id] ?? []).includes(toDateString(date));
                  return (
                    <li key={i.id} className={cn("flex items-center justify-between gap-2", conflict && "text-destructive")}>
                      <span className="truncate">{i.name} — ${i.price}/day</span>
                      {conflict && (
                        <Button size="sm" variant="ghost" onClick={() => removeItem(i.id)}>
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Pick your event date
              </Label>
              <div className="rounded-md border border-border flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={isDateDisabled}
                  className={cn("p-3 pointer-events-auto")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Greyed-out dates are unavailable for at least one item in your cart.
              </p>
              {conflictingItems.length > 0 && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">
                      {conflictingItems.length} item(s) unavailable on this date
                    </p>
                    <p className="text-muted-foreground">Pick another date or remove the conflicting items above.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!canContinueStep1}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Continue
              </Button>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose your delivery (start) time and pickup time. We deliver and pick up between 8:00 AM and 8:00 PM.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Delivery / start time *</Label>
                <Select value={form.event_start_time} onValueChange={(v) => setForm({ ...form, event_start_time: v })}>
                  <SelectTrigger><SelectValue placeholder="Select start time" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {TIME_SLOTS.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Pickup time *</Label>
                <Select value={form.event_end_time} onValueChange={(v) => setForm({ ...form, event_end_time: v })}>
                  <SelectTrigger><SelectValue placeholder="Select pickup time" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {TIME_SLOTS
                      .filter((t) => !form.event_start_time || t.value > form.event_start_time)
                      .map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Event type</Label>
                <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canContinueStep2}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cn">Full name *</Label>
                <Input id="cn" value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cp">Phone *</Label>
                <Input id="cp" type="tel" value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="ce">Email *</Label>
                <Input id="ce" type="email" value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="addr">Event address *</Label>
                <Input id="addr" placeholder="Street address" value={form.event_address_line}
                  onChange={(e) => setForm({ ...form, event_address_line: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={form.event_city}
                  onChange={(e) => setForm({ ...form, event_city: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="zip">ZIP *</Label>
                <Input id="zip" value={form.event_zip}
                  onChange={(e) => setForm({ ...form, event_zip: e.target.value })} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={3} placeholder="Setup surface, gate width, anything else..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>

            <div className="rounded-md bg-muted/50 p-3 text-sm space-y-1">
              <p className="font-semibold">{date && format(date, "EEEE, MMMM d, yyyy")}</p>
              <p className="text-muted-foreground">
                Delivery {TIME_SLOTS.find(t => t.value === form.event_start_time)?.label}
                {" · "}Pickup {TIME_SLOTS.find(t => t.value === form.event_end_time)?.label}
              </p>
              <ul className="text-muted-foreground">
                {items.map((i) => (
                  <li key={i.id}>• {i.name} — ${i.price}/day</li>
                ))}
              </ul>
              <p className="font-semibold pt-1">Total: ${total.toFixed(2)} / day</p>
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(2)} disabled={submitting}>Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : "Reserve Now"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
