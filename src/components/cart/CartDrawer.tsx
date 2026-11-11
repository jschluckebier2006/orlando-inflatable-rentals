import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  DURATION_LABELS, DURATION_MULTIPLIERS, DURATION_DESCRIPTIONS, type DurationType,
  computeBreakdown, formatPct, getDamageWaiverRate, getOnlineCheckoutFeeRate, getTaxRate,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { WeekendDealNote } from "@/components/promo/WeekendDealNote";

const ORDER: DurationType[] = ["7hour", "overnight", "weekend"];
const ORDER_MINIMUM = 100;

export function CartDrawer() {
  const { items, baseTotal, total, duration, setDuration, removeItem, isCartOpen, setCartOpen, openCheckout } = useCart();
  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display">Your Cart</SheetTitle>
          <SheetDescription>
            Add as many items as you'd like. Choose a rental length below — same option applies to all items.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 my-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Your cart is empty.</p>
              <p className="text-sm mt-1">Browse our rentals and tap "Book Now".</p>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                    <img src={it.image} alt={it.name} className="w-16 h-16 object-contain bg-muted/30 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{it.name}</p>
                      <p className="text-sm text-muted-foreground">${it.price} base / day</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeItem(it.id)} aria-label={`Remove ${it.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Choose your rental length</p>
                <div className="space-y-2">
                  {ORDER.map((d) => {
                    const tierTotal = Math.round(baseTotal * DURATION_MULTIPLIERS[d] * 100) / 100;
                    const active = d === duration;
                    const pct = Math.round((DURATION_MULTIPLIERS[d] - 1) * 100);
                    return (
                      <div key={d} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setDuration(d)}
                        className={cn(
                          "w-full text-left rounded-lg border p-3 transition-colors",
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">
                              {DURATION_LABELS[d]}
                              {pct > 0 && (
                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                  +{pct}%
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{DURATION_DESCRIPTIONS[d]}</p>
                          </div>
                          <span className="text-sm font-semibold whitespace-nowrap">${tierTotal.toFixed(2)}</span>
                        </div>
                      </button>
                      {d === "weekend" && <WeekendDealNote source="cart_drawer" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (() => {
          // Estimate with the damage waiver on (it's pre-selected at checkout) and
          // delivery left out — the ZIP sets it at checkout. Cash price.
          const est = computeBreakdown(total, true, 0, "cash_on_delivery");
          return (
          <div className="border-t border-border pt-4 space-y-3">
            <dl className="space-y-1.5 text-sm" aria-label="Estimated total">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Rental ({DURATION_LABELS[duration]})</dt>
                <dd className="text-foreground whitespace-nowrap">${est.subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground shrink-0">Delivery</dt>
                <dd className="text-foreground text-right text-xs leading-snug">
                  Set by your ZIP at checkout (free in most areas, $50 for some outlying ZIPs)
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Damage waiver ({formatPct(getDamageWaiverRate())}, recommended)</dt>
                <dd className="text-foreground whitespace-nowrap">${est.damageWaiver.toFixed(2)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Sales tax ({formatPct(getTaxRate())})</dt>
                <dd className="text-foreground whitespace-nowrap">${est.tax.toFixed(2)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-border pt-1.5 font-semibold">
                <dt className="text-foreground">Estimated total (cash)</dt>
                <dd className="text-foreground whitespace-nowrap" data-testid="cart-estimated-total">${est.total.toFixed(2)}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Paying by card? Card price is {formatPct(getOnlineCheckoutFeeRate())} more. Secure your date with a $5 deposit.
            </p>
            {total < ORDER_MINIMUM && (
              <p className="text-sm font-medium text-destructive text-center">
                Order minimum is ${ORDER_MINIMUM}. Please add ${(ORDER_MINIMUM - total).toFixed(2)} more to continue.
              </p>
            )}
            <Button
              onClick={openCheckout}
              disabled={total < ORDER_MINIMUM}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              size="lg"
            >
              Check Availability & Reserve
            </Button>
          </div>
          );
        })()}
      </SheetContent>
    </Sheet>
  );
}
