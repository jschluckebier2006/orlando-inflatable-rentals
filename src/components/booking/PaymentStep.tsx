import { useEffect, useMemo, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, resolveStripeEnvironment } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { computeBreakdown } from "@/lib/pricing";

const DEPOSIT = 5;
const ORDER_MINIMUM = 100;

interface PaymentStepProps {
  /** Pre-tax, pre-waiver subtotal (items × duration multiplier). */
  subtotal: number;
  damageWaiver: boolean;
  /** Auto-applied delivery fee from the zip-code zone lookup. */
  deliveryFee?: number;
  /** Friendly zone label (e.g. "Avalon Park"). */
  zoneCity?: string | null;
  payload: any; // booking payload posted to create-booking-checkout
  onBack: () => void;
}

export function PaymentStep({ subtotal, damageWaiver, deliveryFee = 0, zoneCity = null, payload, onBack }: PaymentStepProps) {
  const { toast } = useToast();
  const [choice, setChoice] = useState<"deposit" | "full" | "custom" | "deposit_cash">("deposit");
  const bd = useMemo(
    () => computeBreakdown(subtotal, damageWaiver, deliveryFee),
    [subtotal, damageWaiver, deliveryFee],
  );
  const total = bd.total;
  const [customAmount, setCustomAmount] = useState<string>(String(Math.min(total, Math.max(DEPOSIT, Math.round(total / 2)))));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const customNum = Number(customAmount);
  const customValid = customNum >= DEPOSIT && customNum <= total;
  const belowMinimum = bd.subtotal < ORDER_MINIMUM;
  const minimumShortfall = Math.max(0, ORDER_MINIMUM - bd.subtotal);

  const balance = useMemo(() => {
    const charged =
      choice === "deposit" || choice === "deposit_cash"
        ? DEPOSIT
        : choice === "full"
        ? total
        : (customValid ? customNum : 0);
    return Math.max(0, Math.round((total - charged) * 100) / 100);
  }, [choice, total, customValid, customNum]);

  async function startPayment() {
    setLoading(true);
    try {
      const environment = await resolveStripeEnvironment();
      const { data, error } = await supabase.functions.invoke("create-booking-checkout", {
        body: {
          ...payload,
          payment_choice: choice,
          custom_amount: choice === "custom" ? customNum : undefined,
          delivery_fee: deliveryFee,
          delivery_zone_city: zoneCity,
          return_url: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
          environment,
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
        <div className="border border-border rounded-md overflow-hidden">
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret: async () => clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  const Option = ({ value, label, amount, badge, sub, popular }: { value: "deposit" | "full" | "custom" | "deposit_cash"; label: string; amount: string; badge: string; sub: string; popular?: boolean }) => {
    const selected = choice === value;
    return (
      <button
        type="button"
        onClick={() => setChoice(value)}
        role="radio"
        aria-checked={selected}
        className={cn(
          "relative w-full text-left rounded-lg border p-4 sm:p-5 transition-colors",
          selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"
        )}
      >
        {popular && (
          <span className="absolute -top-2 right-3 rounded-full bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-0.5 shadow-sm">
            Most Popular
          </span>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                selected ? "border-primary" : "border-muted-foreground/40"
              )}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            <div className="min-w-0 space-y-1.5">
              <p className="text-sm font-semibold">{label}</p>
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
                {badge}
              </span>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
          <span className="text-sm font-semibold shrink-0">{amount}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/40 p-3 text-sm">
        <div className="space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span>${bd.subtotal.toFixed(2)}</span></div>
          {damageWaiver && (
            <div className="flex justify-between"><span>Damage Waiver (10%)</span><span>${bd.damageWaiver.toFixed(2)}</span></div>
          )}
          {bd.deliveryFee > 0 ? (
            <div className="flex justify-between">
              <span>Delivery {zoneCity ? `— ${zoneCity}` : ""}</span>
              <span>${bd.deliveryFee.toFixed(2)}</span>
            </div>
          ) : zoneCity ? (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <span>Delivery — {zoneCity}</span>
              <span>FREE</span>
            </div>
          ) : null}
          <div className="flex justify-between"><span>Sales Tax (7%)</span><span>${bd.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold pt-1"><span>Order total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <p className="text-xs text-muted-foreground">A $5 non-refundable deposit is due today to secure your date. Your remaining balance will be charged to your card the week of your event, typically 2–5 days before your scheduled date — unless you select the cash on delivery option below.</p>
      </div>

      <div className="rounded-md border border-border p-3 space-y-2">
        <p className="text-sm font-semibold">Cancellation Policy</p>
        <p className="text-xs text-muted-foreground">
          All reservations are considered final upon booking. Cancellations are not permitted once a reservation is confirmed. In the event of severe weather, a declared weather emergency, or other acts of nature affecting your event area, cancellations or reschedules will be accommodated at no charge — please contact us directly in those situations. By confirming this reservation, you authorize Orlando Inflatables LLC to charge your card a $50 cancellation fee in the event of a cancellation outside of weather-related circumstances.
        </p>
        <div className={cn(
          "flex items-start gap-2 pt-1 -mx-1 px-1 rounded-md transition-colors",
          !agreed && "animate-pulse ring-2 ring-primary/60 bg-primary/5"
        )}>
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

      <div className="space-y-2" role="radiogroup" aria-label="Payment plan">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">Choose your payment plan</p>
          <p className="text-xs text-muted-foreground">Select one of the options below to continue.</p>
        </div>
        <Option value="deposit" label="$5 non-refundable deposit" amount="$5.00" badge="Charged today: $5.00" sub="Remaining balance charged to your card the week of your event" popular />
        <Option value="deposit_cash" label="$5 deposit + remaining balance cash on delivery" amount="$5.00" badge="Charged today: $5.00" sub="Remaining balance due in cash on the day of your event" />
        <Option value="full" label="Pay in full now" amount={`$${total.toFixed(2)}`} badge="Charged today: full amount" sub="Nothing owed on delivery — you're all set" />
        <Option value="custom" label="Custom amount" amount={customValid ? `$${customNum.toFixed(2)}` : "—"} badge="Charged today: your chosen amount" sub="Remaining balance charged to your card the week of your event" />
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
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button variant="outline" onClick={onBack} disabled={loading}>Back</Button>
        <div className="flex flex-col items-end gap-2">
          {belowMinimum && (
            <p className="text-sm font-medium text-destructive text-right">
              Order minimum is ${ORDER_MINIMUM}. Please add ${minimumShortfall.toFixed(2)} more to continue.
            </p>
          )}
          <Button
            onClick={startPayment}
            disabled={loading || (choice === "custom" && !customValid) || !agreed || belowMinimum}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</>) : "Confirm Reservation"}
          </Button>
        </div>
      </div>
    </div>
  );
}
