/**
 * Single source of truth for named service areas and their delivery claim.
 * City page templates and schema read this; any city not listed defaults to
 * "call" so a new page can never claim free (or fee) delivery by accident.
 * Statuses follow the ZIP list in src/data/deliveryZones.ts:
 *   "free" — every ZIP for the city is free (or, for Orlando, the East Orlando core is)
 *   "fee"  — the city's ZIPs carry a delivery fee (`fee`, in dollars)
 *   "call" — no online booking (unlisted ZIPs, or a mix of fee and call ZIPs)
 * NOTE: this is marketing copy only — checkout pricing uses the ZIP table.
 */
export type CityDeliveryStatus = "free" | "fee" | "call";

export interface ServiceArea {
  name: string;
  status: CityDeliveryStatus;
  /** Delivery fee in dollars — only for "fee" cities. */
  fee?: number;
}

export const SERVICE_AREAS: ServiceArea[] = [
  { name: "Orlando", status: "free" },
  { name: "Winter Park", status: "free" },
  { name: "Alafaya", status: "free" },
  { name: "Avalon Park", status: "free" },
  { name: "Azalea Park", status: "free" },
  { name: "Chuluota", status: "free" },
  { name: "Eastwood", status: "free" },
  { name: "Stoneybrook", status: "free" },
  { name: "Waterford Lakes", status: "free" },
  { name: "Wedgefield", status: "free" },
  { name: "Bithlo", status: "free" },     // 32820 free
  { name: "Christmas", status: "free" },  // 32709 free
  { name: "Kissimmee", status: "call" },  // no Kissimmee ZIP is listed
  { name: "Apopka", status: "call" },     // 32703 fee + 32712 call → conservative
  { name: "Sanford", status: "fee", fee: 50 }, // 32771, 32773
];

export interface CityDelivery {
  status: CityDeliveryStatus;
  fee: number;
}

export function getCityDelivery(name: string | undefined | null): CityDelivery {
  if (!name) return { status: "call", fee: 0 };
  const n = name.trim().toLowerCase();
  const area = SERVICE_AREAS.find((a) => a.name.toLowerCase() === n);
  if (!area) return { status: "call", fee: 0 };
  if (area.status === "fee") {
    // A "fee" city without a real fee is treated as call — never as free.
    return area.fee && area.fee > 0 ? { status: "fee", fee: area.fee } : { status: "call", fee: 0 };
  }
  return { status: area.status, fee: 0 };
}

export function getCityDeliveryStatus(name: string | undefined | null): CityDeliveryStatus {
  return getCityDelivery(name).status;
}

export const isFreeDeliveryCity = (name: string | undefined | null) => getCityDeliveryStatus(name) === "free";

/** "$50" — whole dollars without cents. */
export const formatDeliveryFee = (fee: number) => `$${Number.isInteger(fee) ? fee : fee.toFixed(2)}`;

/** Fee-city sentence: "$50 delivery, setup included." */
export const feeDeliveryLine = (fee: number) => `${formatDeliveryFee(fee)} delivery, setup included.`;

export const callOrTextLine = (city: string) =>
  `We deliver to ${city} — call or text (407) 497-1840 to book your date.`;

/** Schema.org areaServed: Orange County plus every named city. */
export const SCHEMA_AREA_SERVED = [
  { "@type": "AdministrativeArea", name: "Orange County, FL" },
  ...SERVICE_AREAS.map((a) => ({ "@type": "City", name: `${a.name}, FL` })),
];
