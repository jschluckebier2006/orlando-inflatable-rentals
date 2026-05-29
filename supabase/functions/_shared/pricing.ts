// Shared server-side pricing helpers — mirrors src/lib/pricing.ts so the
// math the customer sees in the browser matches what we record in the DB.

export const DEPOSIT_NET = 5.00;     // net credit applied to the order total
export const DEPOSIT_CHARGE = 5.45;  // amount actually charged today (covers Stripe fees)

export type PaymentMethodChoice = "card_on_file" | "cash_on_delivery";

export interface PriceBreakdown {
  subtotal: number;
  damageWaiver: number;
  deliveryFee: number;
  checkoutFee: number;   // 0 for COD
  taxableBase: number;   // subtotal + waiver + delivery + checkoutFee
  tax: number;
  total: number;         // taxableBase + tax
}

const r = (n: number) => Math.round(n * 100) / 100;

/**
 * Compute the full breakdown.
 *  - 4% Online Payment Convenience Fee applies ONLY when the customer
 *    chooses to pay the remaining balance online (card_on_file).
 *  - The fee is taxable when applied.
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
  const preFee = r(sub + waiver + delivery);
  // Tax is computed on (subtotal + waiver + delivery). The convenience fee
  // is NOT taxed — it's applied as a processing surcharge on the full
  // pre-fee total (including tax), mirroring how Stripe charges its fee.
  const taxableBase = preFee;
  const tax = r(taxableBase * rates.taxRate);
  const preFeeTotal = r(preFee + tax);
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