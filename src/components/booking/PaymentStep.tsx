import { useEffect, useMemo, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { computeBreakdown } from "@/lib/pricing";

const DEPOSIT = 50;

interface PaymentStepProps {
  /** Pre-tax, pre-waiver subtotal (items × duration multiplier). */
  subtotal: number;
  damageWaiver: boolean;
  payload: any; // booking payload posted to create-booking-checkout
  onBack: () => void;
}

export function PaymentStep({ subtotal, damageWaiver, payload, onBack }: PaymentStepProps) {
  const { toast } = useToast();
  const [choice, setChoice] = useState<"deposit" | "full" | "custom">("deposit");
  const bd = useMemo(() => computeBreakdown(subtotal, damageWaiver), [subtotal, damageWaiver]);
  const total = bd.total;
  const [customAmount, setCustomAmount] = useState<string>(String(Math.min(total, Math.max(DEPOSIT, Math.round(total / 2)))));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const customNum = Number(customAmount);
  const customValid = customNum >= DEPOSIT && customNum <= total;

  const balance = useMemo(() => {
    const charged = choice === "deposit" ? DEPOSIT : choice === "full" ? total : (customValid ? customNum : 0);
    return Math.max(0, Math.round((total - charged) * 100) / 100);
  }, [choice, total, customValid, customNum]);

  async function startPayment() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-booking-checkout", {
        body: {
          ...payload,
          payment_choice: choice,
          custom_amount: choice === "custom" ? customNum : undefined,
          return_url: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.clientSecret) {
        const ctx: any = (error as any)?.context;
        let msg = "Could not start payment. Please try again.";
        if (ctx?.json?.error) msg = ctx.json.error;
        else if (typeof ctx?.body === "string") { try { msg = JSON.parse(ctx.body).error ?? msg; } catch {} }
        toast({ title: "Payment failed", description: msg, variant: "destructive" });
        return;
      }
      setClientSecret(data.clientSecret);
    } finally {
      setLoading(false);
    }
  }

  if (clientSecret) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Test card: 4242 4242 4242 4242 · any future expiry · any CVC
        </p>
        <div className="border border-border rounded-md overflow-hidden">
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret: async () => clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  const Option = ({ value, label, amount, sub }: { value: "deposit" | "full" | "custom"; label: string; amount: string; sub: string }) => (
    <button
      type="button"
      onClick={() => setChoice(value)}
      className={cn(
        "w-full text-left rounded-lg border p-3 transition-colors",
        choice === value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
        <span className="text-sm font-semibold">{amount}</span>
      </div>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/40 p-3 text-sm">
        <div className="space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span>${bd.subtotal.toFixed(2)}</span></div>
          {damageWaiver && (
            <div className="flex justify-between"><span>Damage Waiver (10%)</span><span>${bd.damageWaiver.toFixed(2)}</span></div>
          )}
          <div className="flex justify-between"><span>Sales Tax (7%)</span><span>${bd.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold pt-1"><span>Order total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <p className="text-xs text-muted-foreground">Pay any remaining balance in cash or card on delivery day.</p>
      </div>

      <div className="rounded-md border border-border p-3 space-y-2">
        <p className="text-sm font-semibold">Cancellation Policy</p>
        <p className="text-xs text-muted-foreground">
          All reservations are considered final upon booking. Cancellations are not permitted once a reservation is confirmed. In the event of severe weather, a declared weather emergency, or other acts of nature affecting your event area, cancellations or reschedules will be accommodated at no charge — please contact us directly in those situations. By confirming this reservation, you authorize Orlando Inflatables LLC to charge your card a $50 cancellation fee in the event of a cancellation outside of weather-related circumstances.
        </p>
        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="cancel-policy"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="cancel-policy" className="text-xs font-normal leading-relaxed cursor-pointer">
            I have read and agree to the Orlando Inflatables cancellation policy. I understand my reservation is non-refundable and authorize a $50 cancellation fee if applicable.
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Payment option</p>
        <Option value="deposit" label="$50 non-refundable deposit" amount="$50.00" sub="Reserves your date. Applied to your total. Forfeited if cancelled." />
        <Option value="full" label="Pay in full now" amount={`$${total.toFixed(2)}`} sub="Nothing owed on delivery day." />
        <Option value="custom" label="Custom amount" amount={customValid ? `$${customNum.toFixed(2)}` : "—"} sub={`Any amount from $${DEPOSIT} up to $${total.toFixed(2)}.`} />
        {choice === "custom" && (
          <div className="pl-2 pt-1 space-y-1">
            <Label htmlFor="custom-amt" className="text-xs">Amount in USD</Label>
            <Input
              id="custom-amt" type="number" min={DEPOSIT} max={total} step="0.01"
              value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
            />
            {!customValid && <p className="text-xs text-destructive">Must be between ${DEPOSIT} and ${total.toFixed(2)}.</p>}
          </div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Your remaining balance will be charged the week of your event, typically 2–5 days before your scheduled date. No action is needed from you — we will process your saved card at that time.
        </p>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button variant="outline" onClick={onBack} disabled={loading}>Back</Button>
        <Button
          onClick={startPayment}
          disabled={loading || (choice === "custom" && !customValid) || !agreed}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</>) : "Confirm Reservation"}
        </Button>
      </div>
    </div>
  );
}
