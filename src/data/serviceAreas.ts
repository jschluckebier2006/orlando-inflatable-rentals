/**
 * Single source of truth for named service areas and their delivery claim.
 * City page templates and schema read this; any city not listed defaults to
 * "call" so a new page can never claim free delivery by accident.
 * NOTE: this is marketing copy only — checkout pricing uses the ZIP table.
 */
export type CityDeliveryStatus = "free" | "call";

export interface ServiceArea {
  name: string;
  status: CityDeliveryStatus;
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
  { name: "Bithlo", status: "call" },
  { name: "Christmas", status: "call" },
  { name: "Kissimmee", status: "call" },
  { name: "Apopka", status: "call" },
  { name: "Sanford", status: "call" },
];

export function getCityDeliveryStatus(name: string | undefined | null): CityDeliveryStatus {
  if (!name) return "call";
  const n = name.trim().toLowerCase();
  return SERVICE_AREAS.find((a) => a.name.toLowerCase() === n)?.status ?? "call";
}

export const isFreeDeliveryCity = (name: string | undefined | null) => getCityDeliveryStatus(name) === "free";

export const callOrTextLine = (city: string) =>
  `We deliver to ${city} — call or text (407) 497-1840 to book your date.`;

/** Schema.org areaServed: Orange County plus every named city. */
export const SCHEMA_AREA_SERVED = [
  { "@type": "AdministrativeArea", name: "Orange County, FL" },
  ...SERVICE_AREAS.map((a) => ({ "@type": "City", name: `${a.name}, FL` })),
];
