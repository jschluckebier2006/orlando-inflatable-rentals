export type DurationType = "7hour" | "overnight" | "weekend";

export const DURATION_MULTIPLIERS: Record<DurationType, number> = {
  "7hour": 1.0,
  overnight: 1.25,
  weekend: 1.6,
};

export const DURATION_LABELS: Record<DurationType, string> = {
  "7hour": "7-Hour Rental",
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

export const TAX_RATE = 0.07;
export const DAMAGE_WAIVER_RATE = 0.10;

export interface PriceBreakdown {
  subtotal: number;
  damageWaiver: number;
  taxableBase: number;
  tax: number;
  total: number;
}

/** Compute the full price breakdown given a pre-tax subtotal and waiver choice. */
export function computeBreakdown(subtotal: number, waiverSelected: boolean): PriceBreakdown {
  const sub = Math.round(subtotal * 100) / 100;
  const damageWaiver = waiverSelected ? Math.round(sub * DAMAGE_WAIVER_RATE * 100) / 100 : 0;
  const taxableBase = Math.round((sub + damageWaiver) * 100) / 100;
  const tax = Math.round(taxableBase * TAX_RATE * 100) / 100;
  const total = Math.round((sub + damageWaiver + tax) * 100) / 100;
  return { subtotal: sub, damageWaiver, taxableBase, tax, total };
}
