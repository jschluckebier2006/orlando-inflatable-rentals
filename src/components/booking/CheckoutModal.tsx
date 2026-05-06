import { useEffect, useMemo, useState } from "react";
import { format, addDays } from "date-fns";
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
import {
  DURATION_LABELS, DURATION_MULTIPLIERS, DURATION_DESCRIPTIONS, type DurationType,
} from "@/lib/pricing";
import { PaymentStep } from "./PaymentStep";

const EVENT_TYPES = [
  "Birthday Party", "School Event", "Church Event",
  "Corporate Event", "Graduation", "Community Event", "Other",
];

const ORDER: DurationType[] = ["7hour", "overnight", "weekend"];

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
const labelFor = (v: string) => TIME_SLOTS.find((t) => t.value === v)?.label ?? v;
const toDateString = (d: Date) => format(d, "yyyy-MM-dd");

export function CheckoutModal() {
  const { toast } = useToast();
  const {
    items, baseTotal, total, duration, setDuration,
    removeItem, clear, isCheckoutOpen, setCheckoutOpen,
  } = useCart();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>();
  const [bookedMap, setBookedMap] = useState<Record<string, Set<string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    event_address_line: "", event_city: "", event_zip: "",
    event_start_time: "", event_end_time: "",
    event_type: "", notes: "",
  });

  // Apply duration-based time defaults
  useEffect(() => {
    if (duration === "overnight") {
      setForm((f) => ({
        ...f,
        event_start_time: f.event_start_time || "10:00",
        event_end_time: "08:00",
      }));
    } else if (duration === "weekend") {
      setForm((f) => ({ ...f, event_start_time: "08:00", event_end_time: "20:00" }));
    }
    // reset selected date if it no longer fits weekend
    if (duration === "weekend" && date && date.getDay() !== 6) setDate(undefined);
  }, [duration]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setConfirmedId(null);
      setDate(undefined);
    }
  }, [isCheckoutOpen]);

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
      const map: Record<string, Set<string>> = {};
      (data ?? []).forEach((r: { product_id: string; event_date: string }) => {
        (map[r.product_id] ||= new Set()).add(r.event_date);
      });
      setBookedMap(map);
    })();
    return () => { cancelled = true; };
  }, [isCheckoutOpen, items]);

  // Days the booking will occupy given start date + duration
  function occupiedDates(start: Date): string[] {
    if (duration === "7hour") return [toDateString(start)];
    return [toDateString(start), toDateString(addDays(start, 1))];
  }

  const isDateDisabled = (d: Date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (d < today) return true;
    if (duration === "weekend" && d.getDay() !== 6) return true;
    const days = occupiedDates(d);
    return items.some((i) => {
      const set = bookedMap[i.id];
      if (!set) return false;
      return days.some((day) => set.has(day));
    });
  };

  const conflictingItems = useMemo(() => {
    if (!date) return [];
    const days = occupiedDates(date);
    return items.filter((i) => {
      const set = bookedMap[i.id];
      if (!set) return false;
      return days.some((d) => set.has(d));
    });
  }, [date, items, bookedMap, duration]);

  const endDate = date ? (duration === "7hour" ? date : addDays(date, 1)) : undefined;

  const canContinueStep1 = !!date && items.length > 0 && conflictingItems.length === 0;
  const canContinueStep2 =
    !!form.event_start_time && !!form.event_end_time &&
    (duration !== "7hour" || form.event_end_time > form.event_start_time);
  const canSubmit =
    form.customer_name.trim() && form.customer_email.trim() && form.customer_phone.trim() &&
    form.event_address_line.trim() && form.event_city.trim() && form.event_zip.trim();

  async function handleSubmit() {
    if (!date || items.length === 0) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-booking", {
        body: {
          duration_type: duration,
          event_date: toDateString(date),
          event_end_date: toDateString(endDate!),
          price_multiplier: DURATION_MULTIPLIERS[duration],
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
            product_id: i.id,
            product_name: i.name,
            product_price: i.price,
            unit_price: Math.round(i.price * DURATION_MULTIPLIERS[duration] * 100) / 100,
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
              : "Choose your rental length, date, and event details."}
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
            {/* Duration tier selector */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Rental length</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ORDER.map((d) => {
                  const tierTotal = Math.round(baseTotal * DURATION_MULTIPLIERS[d] * 100) / 100;
                  const active = d === duration;
                  const pct = Math.round((DURATION_MULTIPLIERS[d] - 1) * 100);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={cn(
                        "text-left rounded-lg border p-3 transition-colors",
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <p className="text-sm font-semibold">
                        {DURATION_LABELS[d]}
                        {pct > 0 && <span className="ml-1 text-xs text-muted-foreground">+{pct}%</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{DURATION_DESCRIPTIONS[d]}</p>
                      <p className="text-sm font-semibold mt-1">${tierTotal.toFixed(2)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md bg-muted/40 p-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">Items in your cart ({items.length})</p>
              <ul className="space-y-1 text-sm">
                {items.map((i) => {
                  const days = date ? occupiedDates(date) : [];
                  const conflict = days.some((d) => bookedMap[i.id]?.has(d));
                  const charged = Math.round(i.price * DURATION_MULTIPLIERS[duration] * 100) / 100;
                  return (
                    <li key={i.id} className={cn("flex items-center justify-between gap-2", conflict && "text-destructive")}>
                      <span className="truncate">{i.name} — ${charged.toFixed(2)}</span>
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
                <CalendarIcon className="h-4 w-4" />
                {duration === "weekend" ? "Pick your weekend (Saturday delivery)" : "Pick your event date"}
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
                {duration === "weekend"
                  ? "Only Saturdays available. Greyed-out Saturdays mean at least one cart item is booked Sat or Sun."
                  : duration === "overnight"
                  ? "Greyed-out dates mean an item is booked that day or the following morning."
                  : "Greyed-out dates are unavailable for at least one item in your cart."}
              </p>
              {conflictingItems.length > 0 && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">
                      {conflictingItems.length} item(s) unavailable for this date/length
                    </p>
                    <p className="text-muted-foreground">Pick another date, change rental length, or remove the conflicting items above.</p>
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
            {duration === "7hour" && (
              <>
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
                </div>
              </>
            )}

            {duration === "overnight" && (
              <>
                <p className="text-sm text-muted-foreground">
                  Pick your delivery time. Pickup is locked to <strong>8:00 AM the next morning</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Delivery time *</Label>
                    <Select value={form.event_start_time} onValueChange={(v) => setForm({ ...form, event_start_time: v })}>
                      <SelectTrigger><SelectValue placeholder="Select delivery time" /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {TIME_SLOTS.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Pickup time</Label>
                    <Input value="8:00 AM (next day)" readOnly disabled />
                  </div>
                </div>
              </>
            )}

            {duration === "weekend" && (
              <>
                <p className="text-sm text-muted-foreground">
                  Full weekend rentals are <strong>Saturday 8:00 AM</strong> delivery through{" "}
                  <strong>Sunday 8:00 PM</strong> pickup.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Delivery</Label>
                    <Input value="Saturday 8:00 AM" readOnly disabled />
                  </div>
                  <div className="space-y-1">
                    <Label>Pickup</Label>
                    <Input value="Sunday 8:00 PM" readOnly disabled />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label>Event type</Label>
              <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
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
        ) : step === 3 ? (
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
              <p className="font-semibold">{DURATION_LABELS[duration]}</p>
              <p className="text-muted-foreground">
                {date && format(date, "EEEE, MMMM d, yyyy")}
                {duration !== "7hour" && endDate && (
                  <> → {format(endDate, "EEEE, MMMM d, yyyy")}</>
                )}
              </p>
              <p className="text-muted-foreground">
                Delivery {labelFor(form.event_start_time)}
                {" · "}Pickup {labelFor(form.event_end_time)}
                {duration === "overnight" && " (next day)"}
              </p>
              <ul className="text-muted-foreground">
                {items.map((i) => {
                  const charged = Math.round(i.price * DURATION_MULTIPLIERS[duration] * 100) / 100;
                  return <li key={i.id}>• {i.name} — ${charged.toFixed(2)}</li>;
                })}
              </ul>
              <p className="font-semibold pt-1">Total: ${total.toFixed(2)}</p>
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!canSubmit}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Continue to payment
              </Button>
            </div>
          </div>
        ) : (
          <PaymentStep
            total={total}
            onBack={() => setStep(3)}
            payload={{
              duration_type: duration,
              event_date: date ? format(date, "yyyy-MM-dd") : "",
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
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
