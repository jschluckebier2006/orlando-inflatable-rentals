import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/adminActivity";

type Method = "cash" | "check" | "card_external" | "stripe_link" | "stripe_captured";

const METHOD_LABEL: Record<Method, string> = {
  cash: "Cash",
  check: "Check",
  card_external: "Card on site / Square / external",
  stripe_link: "Send Stripe payment link by email",
  stripe_captured: "Stripe payment already captured",
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  bookingId: string;
  defaultAmount?: number;
  customerEmail?: string;
  onRecorded?: () => void;
}

export function RecordPaymentDialog({ open, onOpenChange, bookingId, defaultAmount = 0, customerEmail, onRecorded }: Props) {
  const { toast } = useToast();
  const [method, setMethod] = useState<Method>("cash");
  const [amount, setAmount] = useState<string>("0");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMethod("cash");
      setAmount(String(defaultAmount || 0));
      setReference("");
      setNotes("");
    }
  }, [open, defaultAmount]);

  async function record() {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (method === "stripe_captured" && !/^pi_[A-Za-z0-9]+$/.test(reference.trim())) {
      toast({
        title: "Enter the Stripe PaymentIntent ID",
        description: "It looks like pi_3U71gY0ozdYluEdQ1oeUBWrJ.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    if (method === "stripe_link") {
      // Email a Stripe checkout link via existing edge function
      try {
        const { data, error } = await supabase.functions.invoke("create-booking-checkout", {
          body: { booking_id: bookingId, amount: amt, send_link_email: true, recipient_email: customerEmail },
        });
        if (error) throw error;
        await logActivity({
          bookingId,
          kind: "email_sent",
          message: `Stripe payment link emailed for $${amt.toFixed(2)} to ${customerEmail ?? "customer"}.`,
          metadata: { amount: amt, link: (data as any)?.url ?? null },
        });
        toast({ title: "Payment link sent" });
        onOpenChange(false);
        onRecorded?.();
      } catch (e: any) {
        toast({ title: "Could not send payment link", description: e?.message ?? String(e), variant: "destructive" });
      } finally {
        setSaving(false);
      }
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await (supabase.from("booking_payments") as any).insert({
      booking_id: bookingId,
      method,
      amount: amt,
      reference: reference.trim() || null,
      notes: notes.trim() || null,
      recorded_by: session?.user?.email ?? null,
    });
    if (error) {
      setSaving(false);
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    // Bump status to confirmed if still pending
    await (supabase.from("bookings") as any)
      .update({ status: "confirmed" })
      .eq("id", bookingId)
      .eq("status", "pending");
    await logActivity({
      bookingId,
      kind: "payment",
      message: `Recorded ${METHOD_LABEL[method]} payment of $${amt.toFixed(2)}${reference ? ` (ref: ${reference})` : ""}.`,
      metadata: { method, amount: amt, reference },
    });
    setSaving(false);
    toast({ title: "Payment recorded" });
    onOpenChange(false);
    onRecorded?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Method</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="card_external">Card on site / Square / external</SelectItem>
                <SelectItem value="stripe_link">Send Stripe payment link by email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Amount ($)</Label>
            <Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          {method !== "stripe_link" && (
            <div>
              <Label>{method === "check" ? "Check #" : method === "card_external" ? "Last 4 / reference" : "Reference (optional)"}</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
          )}
          {method !== "stripe_link" && (
            <div>
              <Label>Notes (optional)</Label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          )}
          {method === "stripe_link" && (
            <p className="text-xs text-muted-foreground">
              We'll email a Stripe checkout link to {customerEmail ?? "the customer"} for the entered amount. The booking
              will be marked paid automatically when the customer completes checkout.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={record} disabled={saving}>
            {saving ? "Saving…" : method === "stripe_link" ? "Send link" : "Record payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
