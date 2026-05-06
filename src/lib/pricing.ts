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
