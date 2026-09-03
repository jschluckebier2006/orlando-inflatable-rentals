import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useInventory } from "@/lib/inventory";
import { DURATION_MULTIPLIERS, DURATION_LABELS, type DurationType, endDateFor } from "@/lib/pricing";
import { TAX_RATE, computeBreakdown } from "@/lib/pricing";
import { logActivity } from "@/lib/adminActivity";
import { format } from "date-fns";
import { CalendarClock, CreditCard, Loader2 } from "lucide-react";
import { RescheduleDialog } from "@/components/admin/RescheduleDialog";
import { RecordPaymentDialog } from "@/components/admin/RecordPaymentDialog";


type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
type PaymentStatus = "unpaid" | "deposit_paid" | "paid_in_full" | "refunded";

interface ItemRow {
  id?: string;
  product_id: string;
  product_name: string;
  product_price: number;
  unit_price: number;
}

export interface BookingFormBooking {
  id: string;
  event_date: string;
  event_end_date?: string | null;
  event_start_time: string | null;
  event_end_time: string | null;
  duration_type?: DurationType | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_address_line: string;
  event_city: string;
  event_zip: string;
  event_type?: string | null;
  notes: string | null;
  status: BookingStatus;
  payment_status?: PaymentStatus | null;
  amount_paid?: number | null;
  deposit_amount?: number | null;
  total_amount?: number | null;
  subtotal?: number | null;
  discount_type?: "amount" | "percent" | null;
  discount_value?: number | null;
  discount_amount?: number | null;
  discount_reason?: string | null;
  damage_waiver_selected?: boolean | null;
  damage_waiver_amount?: number | null;
  tax_rate?: number | null;
  tax_amount?: number | null;
  delivery_fee?: number | null;
  checkout_fee_amount?: number | null;
  balance_due?: number | null;
  payment_method_choice?: "card_on_file" | "cash_on_delivery" | null;
  stripe_customer_id?: string | null;
  stripe_payment_method_id?: string | null;
  booking_items?: { id: string; product_id?: string; product_name: string; product_price: number; unit_price?: number | null }[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: BookingFormBooking | null;
  onSaved: () => void;
}

const TIMES = Array.from({ length: 13 }, (_, i) => {
  const h = 8 + i;
  const hr = h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? "PM" : "AM";
  return { value: `${String(h).padStart(2, "0")}:00`, label: `${hr}:00 ${ampm}` };
});

export default function BookingFormModal({ open, onOpenChange, booking, onSaved }: Props) {
  const { toast } = useToast();
  const isEdit = !!booking;
  const [saving, setSaving] = useState(false);
  const { products } = useInventory({ includeInactive: true });

  const [duration, setDuration] = useState<DurationType>("7hour");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("17:00");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [eventType, setEventType] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [amountPaid, setAmountPaid] = useState<string>("0");
  const [items, setItems] = useState<ItemRow[]>([]);
  const [discountType, setDiscountType] = useState<"none" | "amount" | "percent">("none");
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [discountReason, setDiscountReason] = useState("");
  const [damageWaiver, setDamageWaiver] = useState<boolean>(true);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [chargingBalance, setChargingBalance] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  // Re-pricing a booking that already took money must be deliberate, never a
  // side effect of pressing Save.
  const [repriceMode, setRepriceMode] = useState(false);
  const [repriceConfirmOpen, setRepriceConfirmOpen] = useState(false);

  const paymentChoice = booking?.payment_method_choice ?? null;
  // Admin-side payment type selector. "other" behaves like cash (no fee).
  const [paymentMethod, setPaymentMethod] = useState<"card_on_file" | "cash_on_delivery" | "other">("cash_on_delivery");
  const hasSavedCard = !!(booking?.stripe_customer_id && booking?.stripe_payment_method_id);
  const persistedBalance = Number(booking?.balance_due ?? 0);
  const storedPaid = Number(booking?.amount_paid ?? 0);
  const storedTotal = Number(booking?.total_amount ?? 0);
  const storedDeliveryFee = Number(booking?.delivery_fee ?? 0);
  // Any recorded payment freezes the money on this booking.
  const hasPayment = isEdit && storedPaid > 0;
  const moneyLocked = hasPayment && !repriceMode;
  const fullyPaid = booking?.payment_status === "paid_in_full"
    || (storedTotal > 0 && storedPaid >= storedTotal - 0.005);




  async function chargeBalanceNow() {
    if (!booking?.id) return;
    if (!confirm(`Charge the saved card on file for $${persistedBalance.toFixed(2)}?`)) return;
    setChargingBalance(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-charge-balance", {
        body: { booking_id: booking.id },
      });
      if (error) {
        const ctx: any = (error as any)?.context;
        let msg = error.message ?? "Charge failed";
        if (ctx?.json?.error) msg = ctx.json.message ?? ctx.json.error;
        else if (typeof ctx?.body === "string") {
          try { const j = JSON.parse(ctx.body); msg = j.message ?? j.error ?? msg; } catch {}
        }
        toast({ title: "Charge failed", description: msg, variant: "destructive" });
        return;
      }
      toast({
        title: "Balance charged",
        description: `$${Number((data as any)?.amount_charged ?? persistedBalance).toFixed(2)} captured. Customer emailed.`,
      });
      onSaved();
      onOpenChange(false);
    } finally {
      setChargingBalance(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    if (booking) {
      const d = (booking.duration_type as DurationType) || "7hour";
      setDuration(d);
      setEventDate(booking.event_date);
      setStartTime(booking.event_start_time || "10:00");
      setEndTime(booking.event_end_time || "17:00");
      setCustomerName(booking.customer_name || "");
      setEmail(booking.customer_email || "");
      setPhone(booking.customer_phone || "");
      setAddr(booking.event_address_line || "");
      setCity(booking.event_city || "");
      setZip(booking.event_zip || "");
      setEventType(booking.event_type || "");
      setNotes(booking.notes || "");
      setStatus(booking.status);
      setPaymentStatus((booking.payment_status as PaymentStatus) || "unpaid");
      setAmountPaid(String(booking.amount_paid ?? 0));
      setDiscountType((booking.discount_type as any) || "none");
      setDiscountValue(String(booking.discount_value ?? 0));
      setDiscountReason(booking.discount_reason || "");
      setDamageWaiver(booking.damage_waiver_selected ?? true);
      setPaymentMethod(
        (booking.payment_method_choice as any) ?? "cash_on_delivery"
      );
      setItems(
        (booking.booking_items || []).map((i) => ({
          id: i.id,
          product_id: i.product_id || "",
          product_name: i.product_name,
          product_price: Number(i.product_price),
          unit_price: Number(i.unit_price ?? i.product_price),
        }))
      );
    } else {
      setDuration("7hour");
      setEventDate(format(new Date(), "yyyy-MM-dd"));
      setStartTime("10:00");
      setEndTime("17:00");
      setCustomerName(""); setEmail(""); setPhone("");
      setAddr(""); setCity(""); setZip("");
      setEventType(""); setNotes("");
      setStatus("confirmed"); setPaymentStatus("unpaid"); setAmountPaid("0");
      setDiscountType("none"); setDiscountValue("0"); setDiscountReason("");
      setDamageWaiver(true);
      setPaymentMethod("cash_on_delivery");
      setItems([]);
    }
    setRepriceMode(false);
    setRepriceConfirmOpen(false);
  }, [open, booking]);


  const multiplier = DURATION_MULTIPLIERS[duration];
  const subtotal = useMemo(
    () => Math.round(items.reduce((s, i) => s + i.unit_price, 0) * 100) / 100,
    [items]
  );
  const discountAmount = useMemo(() => {
    if (discountType === "none") return 0;
    const v = Number(discountValue) || 0;
    if (discountType === "amount") return Math.min(v, subtotal);
    return Math.round(subtotal * (v / 100) * 100) / 100;
  }, [discountType, discountValue, subtotal]);
  const afterDiscount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
  const bd = useMemo(
    () => computeBreakdown(
      afterDiscount,
      damageWaiver,
      // Carry the booking's own delivery fee through, otherwise re-pricing
      // silently drops it out of the total.
      isEdit ? storedDeliveryFee : 0,
      paymentMethod === "card_on_file" ? "card_on_file" : "cash_on_delivery",
    ),
    [afterDiscount, damageWaiver, isEdit, storedDeliveryFee, paymentMethod]
  );
  const damageWaiverAmount = bd.damageWaiver;
  const deliveryFeeAmount = bd.deliveryFee;
  const taxAmount = bd.tax;
  const checkoutFeeAmount = bd.checkoutFee;
  const total = bd.total;
  const paidAmount = Number(amountPaid) || 0;
  // Paid-in-full is decided by the money, not by the stored status label.
  const isPaidInFull = total > 0 && paidAmount >= total - 0.005;
  const balanceDue = isPaidInFull ? 0 : Math.max(0, Math.round((total - paidAmount) * 100) / 100);
  const derivedPaymentStatus: PaymentStatus =
    paymentStatus === "refunded"
      ? "refunded"
      : isPaidInFull
        ? "paid_in_full"
        : paidAmount > 0
          ? "deposit_paid"
          : "unpaid";

  // While locked, every figure on screen comes straight from the stored row —
  // nothing is recalculated, so nothing can drift away from what was charged.
  const shownSubtotal = moneyLocked ? Number(booking?.subtotal ?? 0) : subtotal;
  const shownDiscount = moneyLocked ? Number(booking?.discount_amount ?? 0) : discountAmount;
  const shownWaiver = moneyLocked ? Number(booking?.damage_waiver_amount ?? 0) : damageWaiverAmount;
  const shownDelivery = moneyLocked ? storedDeliveryFee : deliveryFeeAmount;
  const shownTax = moneyLocked ? Number(booking?.tax_amount ?? 0) : taxAmount;
  const shownFee = moneyLocked ? Number(booking?.checkout_fee_amount ?? 0) : checkoutFeeAmount;
  const shownTotal = moneyLocked ? storedTotal : total;
  const shownPaid = moneyLocked ? storedPaid : paidAmount;
  const shownPaidInFull = shownTotal > 0 && shownPaid >= shownTotal - 0.005;
  const shownBalance = shownPaidInFull
    ? 0
    : Math.max(0, Math.round((shownTotal - shownPaid) * 100) / 100);

  // Re-price preview: what the confirmation dialog spells out before writing.
  const repriceDelta = Math.round((total - storedTotal) * 100) / 100;
  const repriceBalance = Math.round((total - storedPaid) * 100) / 100;




  // Leaving re-price mode restores every pricing field to the stored values,
  // so an abandoned edit cannot linger in the form.
  function cancelReprice() {
    setRepriceMode(false);
    setRepriceConfirmOpen(false);
    if (!booking) return;
    setDuration((booking.duration_type as DurationType) || "7hour");
    setDiscountType((booking.discount_type as any) || "none");
    setDiscountValue(String(booking.discount_value ?? 0));
    setDiscountReason(booking.discount_reason || "");
    setDamageWaiver(booking.damage_waiver_selected ?? true);
    setPaymentMethod((booking.payment_method_choice as any) ?? "cash_on_delivery");
    setPaymentStatus((booking.payment_status as PaymentStatus) || "unpaid");
    setAmountPaid(String(booking.amount_paid ?? 0));
    setItems(
      (booking.booking_items || []).map((i) => ({
        id: i.id,
        product_id: i.product_id || "",
        product_name: i.product_name,
        product_price: Number(i.product_price),
        unit_price: Number(i.unit_price ?? i.product_price),
      }))
    );
  }

  function addProduct(productId: string) {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setItems((arr) => [
      ...arr,
      { product_id: p.id, product_name: p.name, product_price: p.price, unit_price: Math.round(p.price * multiplier * 100) / 100 },
    ]);
  }
  function removeItem(idx: number) { setItems((arr) => arr.filter((_, i) => i !== idx)); }
  function updateItemPrice(idx: number, price: number) {
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, unit_price: price } : it)));
  }

  useEffect(() => {
    setItems((arr) => arr.map((i) => ({ ...i, unit_price: Math.round(i.product_price * multiplier * 100) / 100 })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  async function save(confirmedReprice = false) {
    if (!customerName.trim() || !phone.trim() || !eventDate) {
      toast({ title: "Missing required fields", description: "Customer name, phone, and date are required.", variant: "destructive" });
      return;
    }
    // Changing the price of a booking that already took money needs an explicit
    // confirmation showing the consequence.
    if (hasPayment && repriceMode && !confirmedReprice) {
      setRepriceConfirmOpen(true);
      return;
    }
    setSaving(true);
    const endDate = format(endDateFor(new Date(eventDate + "T12:00:00"), duration), "yyyy-MM-dd");
    const payload: any = {
      event_date: eventDate,
      event_end_date: endDate,
      event_start_time: startTime,
      event_end_time: endTime,
      customer_name: customerName.trim(),
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      event_address_line: addr.trim(),
      event_city: city.trim(),
      event_zip: zip.trim(),
      event_type: eventType.trim() || null,
      notes: notes.trim() || null,
      status,
    };

    // Locked bookings write no money columns at all — the stored totals, tax,
    // fees, items and payment figures are left exactly as they are.
    if (!moneyLocked) {
      Object.assign(payload, {
        duration_type: duration,
        price_multiplier: multiplier,
        payment_status: derivedPaymentStatus,
        amount_paid: paidAmount,
        subtotal,
        discount_type: discountType === "none" ? null : discountType,
        discount_value: discountType === "none" ? null : Number(discountValue) || 0,
        discount_amount: discountAmount,
        discount_reason: discountType === "none" ? null : (discountReason.trim() || null),
        damage_waiver_selected: damageWaiver,
        damage_waiver_amount: damageWaiverAmount,
        delivery_fee: deliveryFeeAmount,
        tax_rate: TAX_RATE,
        tax_amount: taxAmount,
        checkout_fee_amount: checkoutFeeAmount,
        payment_method_choice: paymentMethod === "other" ? null : paymentMethod,
        total_amount: total,
        balance_due: balanceDue,
        product_id: items[0]?.product_id ?? null,
        product_name: items[0]?.product_name ?? null,
        product_price: items[0]?.product_price ?? null,
      });
    }

    let bookingId = booking?.id;
    if (isEdit && bookingId) {
      const { error } = await (supabase.from("bookings") as any).update(payload).eq("id", bookingId);
      if (error) { setSaving(false); toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
      if (!moneyLocked) await supabase.from("booking_items").delete().eq("booking_id", bookingId);
    } else {
      const { data, error } = await (supabase.from("bookings") as any).insert(payload).select("id").single();
      if (error || !data) { setSaving(false); toast({ title: "Create failed", description: error?.message, variant: "destructive" }); return; }
      bookingId = data.id;
    }

    if (!moneyLocked && items.length > 0 && bookingId) {
      const rows = items.map((i) => ({
        booking_id: bookingId!,
        product_id: i.product_id,
        product_name: i.product_name,
        product_price: i.product_price,
        unit_price: i.unit_price,
      }));
      const { error: itemErr } = await supabase.from("booking_items").insert(rows);
      if (itemErr) { setSaving(false); toast({ title: "Item save failed", description: itemErr.message, variant: "destructive" }); return; }
    }

    if (hasPayment && repriceMode && bookingId) {
      const outcome = repriceBalance > 0.005
        ? `$${repriceBalance.toFixed(2)} balance due`
        : repriceBalance < -0.005
          ? `$${Math.abs(repriceBalance).toFixed(2)} credit owed to customer`
          : "settled in full";
      await logActivity({
        bookingId,
        kind: "payment",
        message: `Booking re-priced: $${storedTotal.toFixed(2)} → $${total.toFixed(2)} (paid $${storedPaid.toFixed(2)}, ${outcome})`,
        metadata: {
          reason: "manual_reprice",
          old_total: storedTotal,
          new_total: total,
          amount_paid: storedPaid,
          resulting_balance: repriceBalance,
        },
      });
    }

    setSaving(false);
    toast({ title: isEdit ? "Booking updated" : "Booking created" });
    onSaved();
    onOpenChange(false);
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[95vh] sm:h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>{isEdit ? "Edit Booking" : "New Booking"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <section className="space-y-3">
            <h3 className="font-semibold">Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>Full name *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div>
              <div><Label>Phone *</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div className="md:col-span-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="md:col-span-2"><Label>Address</Label><Input value={addr} onChange={(e) => setAddr(e.target.value)} /></div>
              <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
              <div><Label>ZIP</Label><Input value={zip} onChange={(e) => setZip(e.target.value)} /></div>
              <div className="md:col-span-2"><Label>Event type</Label><Input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="Birthday party, church event, etc." /></div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold">Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Duration</Label>
                <Select value={duration} onValueChange={(v) => setDuration(v as DurationType)} disabled={moneyLocked}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["7hour", "overnight", "weekend"] as DurationType[]).map((d) => (
                      <SelectItem key={d} value={d}>{DURATION_LABELS[d]} ({DURATION_MULTIPLIERS[d]}x)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Event date *</Label>
                <div className="flex gap-2">
                  <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                  {isEdit && booking?.id && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setRescheduleOpen(true)}>
                      <CalendarClock className="h-4 w-4 mr-1" /> Edit date
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label>Start time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pickup time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Items</h3>
              <Select value="" onValueChange={addProduct} disabled={moneyLocked}>
                <SelectTrigger className="w-64"><SelectValue placeholder="+ Add product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name} — ${p.price}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items added yet.</p>
            ) : (
              <ul className="divide-y border border-border rounded-md">
                {items.map((it, idx) => (
                  <li key={idx} className="p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{it.product_name}</div>
                      <div className="text-xs text-muted-foreground">Base ${it.product_price} × {multiplier}x</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">$</span>
                      <Input type="number" step="0.01" className="w-24" value={it.unit_price} onChange={(e) => updateItemPrice(idx, Number(e.target.value) || 0)} disabled={moneyLocked} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} disabled={moneyLocked}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold">Discount</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={discountType} onValueChange={(v) => setDiscountType(v as any)} disabled={moneyLocked}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No discount</SelectItem>
                    <SelectItem value="amount">$ Off</SelectItem>
                    <SelectItem value="percent">% Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{discountType === "percent" ? "Percent (%)" : "Amount ($)"}</Label>
                <Input type="number" step="0.01" min="0" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} disabled={moneyLocked || discountType === "none"} />
              </div>
              <div>
                <Label>Reason (optional)</Label>
                <Input value={discountReason} onChange={(e) => setDiscountReason(e.target.value)} disabled={moneyLocked || discountType === "none"} placeholder="Repeat customer" />
              </div>
            </div>
          </section>

          <section className="bg-muted/30 rounded-md p-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${shownSubtotal.toFixed(2)}</span></div>
            {shownDiscount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Discount{!moneyLocked && discountType === "percent" ? ` (${discountValue}%)` : ""}</span>
                <span>−${shownDiscount.toFixed(2)}</span>
              </div>
            )}
            {shownWaiver > 0 && (
              <div className="flex justify-between"><span>Damage Waiver (10%)</span><span>${shownWaiver.toFixed(2)}</span></div>
            )}
            {shownDelivery > 0 && (
              <div className="flex justify-between"><span>Delivery</span><span>${shownDelivery.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between"><span>Sales Tax (6.5%)</span><span>${shownTax.toFixed(2)}</span></div>
            {shownFee > 0 && (
              <div className="flex justify-between">
                <span>Online Payment Convenience Fee (4%)</span>
                <span>${shownFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${shownTotal.toFixed(2)}</span></div>
            {shownPaidInFull ? (
              <div className="flex justify-between font-semibold text-green-700">
                <span>Paid in full</span>
                <span>Paid ${shownPaid.toFixed(2)} of ${shownTotal.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between"><span>Paid</span><span>${shownPaid.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold"><span>Balance due</span><span>${shownBalance.toFixed(2)}</span></div>
              </>
            )}

            {hasPayment && (
              <div className="pt-3 mt-2 border-t flex items-start gap-2">
                {moneyLocked ? (
                  <>
                    <Lock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        This booking has a payment recorded, so the pricing is locked. Editing contact details,
                        address, times or notes will not change the money.
                      </p>
                      <Button type="button" variant="outline" size="sm" onClick={() => setRepriceMode(true)}>
                        Re-price booking
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-medium text-destructive">
                      Re-pricing mode — saving will change the total for a booking that has already been paid.
                      You'll be asked to confirm.
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={cancelReprice}>
                      Cancel re-pricing
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>


          <section className="space-y-2">
            <Label>Damage Waiver</Label>
            <Select value={damageWaiver ? "yes" : "no"} onValueChange={(v) => setDamageWaiver(v === "yes")} disabled={moneyLocked}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes - Recommended (10%)</SelectItem>
                <SelectItem value="no">No - Decline waiver</SelectItem>
              </SelectContent>
            </Select>
          </section>

          <section className="space-y-2">
            <Label>Payment type</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} disabled={moneyLocked}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="card_on_file">Card (adds 4% Online Payment Convenience Fee)</SelectItem>
                <SelectItem value="cash_on_delivery">Cash on Delivery (no fee)</SelectItem>
                <SelectItem value="other">Other (no fee)</SelectItem>
              </SelectContent>
            </Select>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold">Status & Payment</h3>
            {isEdit && booking && persistedBalance > 0 && !fullyPaid && !isPaidInFull && (
              <div className="rounded-md border border-border p-3 bg-muted/30 space-y-2">
                {paymentChoice === "card_on_file" && hasSavedCard ? (
                  <>
                    <p className="text-sm">
                      <span className="font-semibold">Online balance pending</span> — card on file ready to capture.
                      Outstanding <strong>${persistedBalance.toFixed(2)}</strong>.
                    </p>
                    <Button type="button" size="sm" onClick={chargeBalanceNow} disabled={chargingBalance}>
                      {chargingBalance ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Charging…</> : <><CreditCard className="h-4 w-4 mr-1" />Charge balance now</>}
                    </Button>
                  </>
                ) : paymentChoice === "cash_on_delivery" ? (
                  <>
                    <p className="text-sm">
                      <span className="font-semibold">Cash balance pending</span> — collect <strong>${persistedBalance.toFixed(2)}</strong> on delivery.
                    </p>
                    <Button type="button" size="sm" variant="outline" onClick={() => setRecordPaymentOpen(true)}>
                      Mark cash collected
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No saved card on file — record this payment manually using the form below.
                  </p>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Booking status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment status</Label>
                <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)} disabled={moneyLocked}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="deposit_paid">Deposit paid</SelectItem>
                    <SelectItem value="paid_in_full">Paid in full</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount paid ($)</Label>
                <Input type="number" step="0.01" min="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} disabled={hasPayment} />
              </div>
            </div>
          </section>

          <section>
            <Label>Internal notes</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </section>
        </div>

        <DialogFooter className="shrink-0 border-t px-6 py-3 bg-background">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={() => save()} disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Create booking"}</Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={repriceConfirmOpen} onOpenChange={setRepriceConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Re-price this booking?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Current total</span><span>${storedTotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold"><span>New total</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Already paid</span><span>${storedPaid.toFixed(2)}</span></div>
                {repriceBalance > 0.005 ? (
                  <div className="flex justify-between font-semibold text-destructive">
                    <span>Balance due after change</span><span>${repriceBalance.toFixed(2)}</span>
                  </div>
                ) : repriceBalance < -0.005 ? (
                  <div className="flex justify-between font-semibold text-destructive">
                    <span>Credit owed to customer</span><span>${Math.abs(repriceBalance).toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between font-semibold text-green-700">
                    <span>Result</span><span>Paid in full</span>
                  </div>
                )}
                <p className="pt-1">
                  {repriceDelta === 0
                    ? "The total does not change."
                    : `This changes the total by ${repriceDelta > 0 ? "+" : "−"}$${Math.abs(repriceDelta).toFixed(2)} and will be recorded in the booking activity log.`}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setRepriceConfirmOpen(false); save(true); }} disabled={saving}>
              Confirm new price
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isEdit && booking?.id && (
        <RescheduleDialog
          open={rescheduleOpen}
          onOpenChange={setRescheduleOpen}
          bookingId={booking.id}
          currentStart={eventDate}
          currentEnd={booking.event_end_date || eventDate}
          productIds={items.map((i) => i.product_id).filter(Boolean)}
          onRescheduled={() => {
            onSaved();
            onOpenChange(false);
          }}
        />
      )}
      {isEdit && booking?.id && (
        <RecordPaymentDialog
          open={recordPaymentOpen}
          onOpenChange={setRecordPaymentOpen}
          bookingId={booking.id}
          defaultAmount={persistedBalance}
          customerEmail={booking.customer_email}
          onRecorded={() => {
            onSaved();
            onOpenChange(false);
          }}
        />
      )}
    </Dialog>
  );
}
