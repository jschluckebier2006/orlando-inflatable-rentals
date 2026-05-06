import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { products as allProducts, type Product } from "@/data/inventory";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
}

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM",
];

const EVENT_TYPES = [
  "Birthday Party", "School Event", "Church Event",
  "Corporate Event", "Graduation", "Community Event", "Other",
];

function toDateString(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function BookingModal({ open, onOpenChange, product }: BookingModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState<string>(product?.id ?? "");
  const [date, setDate] = useState<Date | undefined>();
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    event_address_line: "",
    event_city: "",
    event_zip: "",
    event_start_time: "",
    event_type: "",
    notes: "",
  });

  const activeProduct = useMemo(
    () => allProducts.find((p) => p.id === selectedProductId),
    [selectedProductId],
  );

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setStep(1);
      setConfirmedId(null);
      setSelectedProductId(product?.id ?? "");
      setDate(undefined);
    }
  }, [open, product?.id]);

  // Load booked dates whenever the chosen product changes
  useEffect(() => {
    if (!selectedProductId) {
      setBookedDates([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("get_booked_dates", {
        _product_id: selectedProductId,
      });
      if (cancelled) return;
      if (error) {
        console.error("get_booked_dates failed", error);
        setBookedDates([]);
        return;
      }
      setBookedDates((data ?? []).map((r: { event_date: string }) => r.event_date));
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedProductId, open]);

  const isDateDisabled = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return true;
    return bookedDates.includes(toDateString(d));
  };

  const canContinueStep1 = !!activeProduct && !!date;
  const canSubmit =
    form.customer_name.trim() &&
    form.customer_email.trim() &&
    form.customer_phone.trim() &&
    form.event_address_line.trim() &&
    form.event_city.trim() &&
    form.event_zip.trim();

  async function handleSubmit() {
    if (!activeProduct || !date) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-booking", {
        body: {
          product_id: activeProduct.id,
          product_name: activeProduct.name,
          product_price: activeProduct.price,
          event_date: toDateString(date),
          event_start_time: form.event_start_time || null,
          event_type: form.event_type || null,
          customer_name: form.customer_name.trim(),
          customer_email: form.customer_email.trim(),
          customer_phone: form.customer_phone.trim(),
          event_address_line: form.event_address_line.trim(),
          event_city: form.event_city.trim(),
          event_zip: form.event_zip.trim(),
          notes: form.notes.trim() || null,
        },
      });
      if (error) {
        // FunctionsHttpError exposes context with the response body
        const ctx: any = (error as any).context;
        let msg = "Could not submit your booking. Please try again.";
        if (ctx?.json?.error) msg = ctx.json.error;
        else if (typeof ctx?.body === "string") {
          try { msg = JSON.parse(ctx.body).error ?? msg; } catch {}
        }
        toast({ title: "Booking failed", description: msg, variant: "destructive" });
        // Refresh booked dates in case it was a conflict
        if (selectedProductId) {
          supabase.rpc("get_booked_dates", { _product_id: selectedProductId })
            .then(({ data }) => setBookedDates((data ?? []).map((r: any) => r.event_date)));
        }
        return;
      }
      setConfirmedId(data.id);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {confirmedId ? "Reservation Received!" : "Reserve Your Rental"}
          </DialogTitle>
          <DialogDescription>
            {confirmedId
              ? "We'll confirm by phone or email shortly."
              : "Pick a date, then enter your event details. Booked dates are blocked out automatically."}
          </DialogDescription>
        </DialogHeader>

        {confirmedId ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <p className="text-foreground">
              Your reservation reference is{" "}
              <span className="font-mono font-semibold">{confirmedId.slice(0, 8)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              We've reserved <strong>{activeProduct?.name}</strong> for{" "}
              <strong>{date && format(date, "EEEE, MMMM d, yyyy")}</strong>. A team member will
              reach out at <strong>{form.customer_phone}</strong> to finalize details.
            </p>
            <Button onClick={() => onOpenChange(false)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Close
            </Button>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            {!product && (
              <div className="space-y-2">
                <Label>Choose a unit</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rental..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {allProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — ${p.price}/day
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeProduct && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <p className="font-semibold text-foreground">{activeProduct.name}</p>
                  <p className="text-sm text-muted-foreground">${activeProduct.price} / day</p>
                </div>
              </div>
            )}

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
              {selectedProductId && bookedDates.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Greyed-out dates are already booked for this unit.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!canContinueStep1}
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
              <div className="space-y-1">
                <Label>Start time</Label>
                <Select value={form.event_start_time}
                  onValueChange={(v) => setForm({ ...form, event_start_time: v })}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Event type</Label>
                <Select value={form.event_type}
                  onValueChange={(v) => setForm({ ...form, event_type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={3} placeholder="Setup surface, gate width, anything else..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>

            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <p><strong>{activeProduct?.name}</strong> · ${activeProduct?.price}/day</p>
              <p className="text-muted-foreground">
                {date && format(date, "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} disabled={submitting}>Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : "Reserve This Date"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
