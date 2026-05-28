export type DurationType = "7hour" | "overnight" | "weekend";

export const DURATION_MULTIPLIERS: Record<DurationType, number> = {
  "7hour": 1.0,
  overnight: 1.25,
  weekend: 1.6,
};

export const DURATION_LABELS: Record<DurationType, string> = {
  "7hour": "Day Rental (7-Hours)",
  overnight: "Overnight",
  weekend: "Full Weekend",
};

export const DURATION_DESCRIPTIONS: Record<DurationType, string> = {
  "7hour": "Same-day rental, delivery and pickup between 8 AM and 8 PM.",
  overnight: "Delivery your chosen day, pickup at 8 AM the next morning.",
  weekend: "Saturday 8 AM delivery through Sunday 8 PM pickup.",
};

export function priceFor(base: number, duration: DurationType) {
  return Math.round(base * DURATION_MULTIPLIERS[duration] * 100) / 100;
}

export function endDateFor(start: Date, duration: DurationType): Date {
  const d = new Date(start);
  if (duration === "7hour") return d;
  d.setDate(d.getDate() + 1);
  return d;
}

export function isSaturday(d: Date) {
  return d.getDay() === 6;
}

import { getSettings } from "./appSettings";

/** @deprecated Use getTaxRate() — kept for backwards compatibility. Reflects DEFAULT, not live value. */
export const TAX_RATE = 0.065;
/** @deprecated Use getDamageWaiverRate() — kept for backwards compatibility. Reflects DEFAULT, not live value. */
export const DAMAGE_WAIVER_RATE = 0.10;

export const getTaxRate = () => getSettings().taxRate;
export const getDamageWaiverRate = () => getSettings().damageWaiverRate;
export const getDefaultDeposit = () => getSettings().defaultDeposit;
export const getOnlineCheckoutFeeRate = () => getSettings().onlineCheckoutFeeRate;

export const DEPOSIT_NET = 5.00;
export const DEPOSIT_CHARGE = 5.45;

export type PaymentMethodChoice = "card_on_file" | "cash_on_delivery";

export interface PriceBreakdown {
  subtotal: number;
  damageWaiver: number;
  deliveryFee: number;
  checkoutFee: number;
  taxableBase: number;
  tax: number;
  total: number;
}

/**
 * Compute the full price breakdown.
 * - 4% Online Payment Convenience Fee applies ONLY when paymentChoice === 'card_on_file'.
 * - The fee is taxable when applied.
 * - Tax applies to (subtotal + waiver + delivery + fee) per FL sales tax law.
 */
export function computeBreakdown(
  subtotal: number,
  waiverSelected: boolean,
  deliveryFee: number = 0,
  paymentChoice: PaymentMethodChoice = "card_on_file",
): PriceBreakdown {
  const taxRate = getTaxRate();
  const waiverRate = getDamageWaiverRate();
  const feeRate = getOnlineCheckoutFeeRate();
  const sub = Math.round(subtotal * 100) / 100;
  const damageWaiver = waiverSelected ? Math.round(sub * waiverRate * 100) / 100 : 0;
  const delivery = Math.round(Math.max(0, deliveryFee) * 100) / 100;
  const preFee = Math.round((sub + damageWaiver + delivery) * 100) / 100;
  const checkoutFee = paymentChoice === "card_on_file"
    ? Math.round(preFee * feeRate * 100) / 100
    : 0;
  const taxableBase = Math.round((preFee + checkoutFee) * 100) / 100;
  const tax = Math.round(taxableBase * taxRate * 100) / 100;
  const total = Math.round((taxableBase + tax) * 100) / 100;
  return { subtotal: sub, damageWaiver, deliveryFee: delivery, checkoutFee, taxableBase, tax, total };
}
