// Shared server-side pricing helpers — mirrors src/lib/pricing.ts so the
// math the customer sees in the browser matches what we record in the DB.

export const DEPOSIT_NET = 5.00;     // net credit applied to the order total
export const DEPOSIT_CHARGE = 5.45;  // amount actually charged today (covers Stripe fees)

export type PaymentMethodChoice = "card_on_file" | "cash_on_delivery";

export interface PriceBreakdown {
  subtotal: number;
  damageWaiver: number;
  deliveryFee: number;
  checkoutFee: number;   // card price minus cash price; 0 for COD
  taxableBase: number;   // subtotal + waiver (delivery is NOT taxed)
  tax: number;
  total: number;         // subtotal + waiver + delivery + tax + checkoutFee
}

const r = (n: number) => Math.round(n * 100) / 100;

/**
 * Compute the full breakdown. Mirrors src/lib/pricing.ts exactly.
 *  - Damage waiver: % of the rental subtotal only (never the delivery fee).
 *  - Sales tax: on rentals (subtotal + waiver) only — the delivery fee is not taxed.
 *  - Card price: every card payment (card_on_file) pays the cash total ×
 *    (1 + card rate, 3% today), including delivery and tax. Cash on delivery
 *    pays the lower cash price. The card difference itself is not taxed.
 *    `checkoutFee` is that card-minus-cash difference (0 for cash).
 */
export function computeBreakdown(
  subtotal: number,
  waiverSelected: boolean,
  deliveryFee: number,
  rates: { taxRate: number; waiverRate: number; checkoutFeeRate: number },
  paymentChoice: PaymentMethodChoice = "card_on_file",
): PriceBreakdown {
  const sub = r(subtotal);
  const waiver = waiverSelected ? r(sub * rates.waiverRate) : 0;
  const delivery = r(Math.max(0, deliveryFee));
  const taxableBase = r(sub + waiver);
  const tax = r(taxableBase * rates.taxRate);
  const preFeeTotal = r(taxableBase + delivery + tax);
  const checkoutFee = paymentChoice === "card_on_file"
    ? r(preFeeTotal * rates.checkoutFeeRate)
    : 0;
  const total = r(preFeeTotal + checkoutFee);
  return {
    subtotal: sub,
    damageWaiver: waiver,
    deliveryFee: delivery,
    checkoutFee,
    taxableBase,
    tax,
    total,
  };
}

/** Percent text for a tax rate: 0.065 → "6.5%", 0.07 → "7%". Label only — no math. */
export function formatTaxPct(rate: number): string {
  return `${Number((rate * 100).toFixed(3))}%`;
}

/**
 * Card-over-cash percent a saved booking was actually priced at, read back from
 * its stored amounts (older bookings were 4%). Null when it can't be derived.
 */
export function cardPctFromAmounts(cardDifference: number, cardTotal: number): string | null {
  const cash = cardTotal - cardDifference;
  const rate = cash > 0 ? cardDifference / cash : NaN;
  return Number.isFinite(rate) && rate > 0 ? `${Number((rate * 100).toFixed(1))}%` : null;
}
