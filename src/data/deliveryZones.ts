// =====================================================================
// Orlando Inflatables — Delivery zones, by ZIP code.
// Three states exist:
//   "free" — $0 delivery, bookable online
//   "fee"  — bookable online; the zone's `fee` is added as a delivery charge
//   "call" — online booking blocked; customer calls/texts or sends a request
// Any ZIP not listed here is treated as "call". Never default to free or fee.
// This file has two byte-identical copies — keep them identical:
//   src/data/deliveryZones.ts
//   supabase/functions/_shared/deliveryZones.ts
// The delivery_zones database table overrides both at runtime.
// The delivery fee is never taxed and never carries the damage waiver.
// =====================================================================

export type ZoneStatus = "free" | "fee" | "call";

export interface DeliveryZone {
  zip: string;
  city: string;
  fee: number; // delivery charge in dollars: > 0 for "fee" ZIPs, 0 for "free" and "call"
  status: ZoneStatus;
}

export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  // Free delivery, bookable online (35 ZIPs)
  "32701": { zip: "32701", city: "Altamonte Springs", fee: 0, status: "free" },
  "32707": { zip: "32707", city: "Casselberry", fee: 0, status: "free" },
  "32708": { zip: "32708", city: "Winter Springs", fee: 0, status: "free" },
  "32709": { zip: "32709", city: "Christmas", fee: 0, status: "free" },
  "32730": { zip: "32730", city: "Casselberry", fee: 0, status: "free" },
  "32733": { zip: "32733", city: "Goldenrod", fee: 0, status: "free" },
  "32751": { zip: "32751", city: "Maitland", fee: 0, status: "free" },
  "32765": { zip: "32765", city: "Oviedo", fee: 0, status: "free" },
  "32766": { zip: "32766", city: "Chuluota", fee: 0, status: "free" },
  "32789": { zip: "32789", city: "Winter Park", fee: 0, status: "free" },
  "32792": { zip: "32792", city: "Aloma / Winter Park", fee: 0, status: "free" },
  "32801": { zip: "32801", city: "Orlando", fee: 0, status: "free" },
  "32803": { zip: "32803", city: "Orlando", fee: 0, status: "free" },
  "32804": { zip: "32804", city: "Orlando", fee: 0, status: "free" },
  "32805": { zip: "32805", city: "Orlando", fee: 0, status: "free" },
  "32806": { zip: "32806", city: "Orlando", fee: 0, status: "free" },
  "32807": { zip: "32807", city: "Azalea Park", fee: 0, status: "free" },
  "32809": { zip: "32809", city: "Orlando", fee: 0, status: "free" },
  "32812": { zip: "32812", city: "Orlando", fee: 0, status: "free" },
  "32814": { zip: "32814", city: "Baldwin Park", fee: 0, status: "free" },
  "32817": { zip: "32817", city: "Orlando", fee: 0, status: "free" },
  "32819": { zip: "32819", city: "Orlando / Doctor Phillips", fee: 0, status: "free" },
  "32820": { zip: "32820", city: "Bithlo", fee: 0, status: "free" },
  "32822": { zip: "32822", city: "Orlando", fee: 0, status: "free" },
  "32824": { zip: "32824", city: "Orlando", fee: 0, status: "free" },
  "32825": { zip: "32825", city: "Orlando", fee: 0, status: "free" },
  "32826": { zip: "32826", city: "Alafaya", fee: 0, status: "free" },
  "32827": { zip: "32827", city: "Orlando / Lake Nona", fee: 0, status: "free" },
  "32828": { zip: "32828", city: "Avalon Park / Waterford Lakes", fee: 0, status: "free" },
  "32829": { zip: "32829", city: "Alafaya", fee: 0, status: "free" },
  "32831": { zip: "32831", city: "Orlando", fee: 0, status: "free" },
  "32832": { zip: "32832", city: "Lake Nona", fee: 0, status: "free" },
  "32833": { zip: "32833", city: "Wedgefield", fee: 0, status: "free" },
  "32837": { zip: "32837", city: "Orlando", fee: 0, status: "free" },
  "32839": { zip: "32839", city: "Orlando", fee: 0, status: "free" },
  // Delivery fee added, bookable online (18 ZIPs)
  "32703": { zip: "32703", city: "Apopka", fee: 50, status: "fee" },
  "32714": { zip: "32714", city: "Altamonte Springs", fee: 50, status: "fee" },
  "32746": { zip: "32746", city: "Lake Mary", fee: 50, status: "fee" },
  "32750": { zip: "32750", city: "Longwood", fee: 50, status: "fee" },
  "32771": { zip: "32771", city: "Sanford", fee: 50, status: "fee" },
  "32773": { zip: "32773", city: "Sanford", fee: 50, status: "fee" },
  "32779": { zip: "32779", city: "Longwood", fee: 50, status: "fee" },
  "32808": { zip: "32808", city: "Orlando", fee: 50, status: "fee" },
  "32810": { zip: "32810", city: "Orlando", fee: 50, status: "fee" },
  "32811": { zip: "32811", city: "Orlando", fee: 50, status: "fee" },
  "32818": { zip: "32818", city: "Orlando", fee: 50, status: "fee" },
  "32821": { zip: "32821", city: "Orlando", fee: 50, status: "fee" },
  "32835": { zip: "32835", city: "Orlando", fee: 50, status: "fee" },
  "32836": { zip: "32836", city: "Orlando / Doctor Phillips", fee: 50, status: "fee" },
  "34734": { zip: "34734", city: "Gotha", fee: 50, status: "fee" },
  "34761": { zip: "34761", city: "Ocoee", fee: 50, status: "fee" },
  "34786": { zip: "34786", city: "Windermere", fee: 50, status: "fee" },
  "34787": { zip: "34787", city: "Winter Garden", fee: 50, status: "fee" },
  // Call/text or send a request — online booking blocked (6 ZIPs)
  "32712": { zip: "32712", city: "Apopka", fee: 0, status: "call" },
  "32830": { zip: "32830", city: "Orlando", fee: 0, status: "call" },
  "34711": { zip: "34711", city: "Clermont", fee: 0, status: "call" },
  "34714": { zip: "34714", city: "Clermont", fee: 0, status: "call" },
  "34715": { zip: "34715", city: "Clermont", fee: 0, status: "call" },
  "34760": { zip: "34760", city: "Oakland", fee: 0, status: "call" },
};

/** First 5 digits of a ZIP (handles ZIP+4 and whitespace), or null. */
export function normalizeZip(input: string | null | undefined): string | null {
  if (!input) return null;
  const zip = String(input).trim().slice(0, 5);
  return /^\d{5}$/.test(zip) ? zip : null;
}

/** Look up a ZIP in a zone map. Unknown ZIPs return null (= call). */
export function lookupZoneIn(
  zones: Record<string, DeliveryZone>,
  input: string | null | undefined,
): DeliveryZone | null {
  const zip = normalizeZip(input);
  return zip ? zones[zip] ?? null : null;
}

/** Online booking is allowed only for known "free" or "fee" ZIPs. */
export function isZoneBookableOnline(zone: DeliveryZone | null | undefined): boolean {
  return !!zone && (zone.status === "free" || zone.status === "fee");
}

/** Delivery charge for a zone: its fee for "fee" ZIPs, otherwise 0. */
export function deliveryFeeForZone(zone: DeliveryZone | null | undefined): number {
  if (!zone || zone.status !== "fee") return 0;
  const fee = Math.round(Number(zone.fee) * 100) / 100;
  return Number.isFinite(fee) && fee > 0 ? fee : 0;
}

/**
 * Normalize a delivery_zones database row. Anything unexpected becomes "call"
 * (a "fee" row without a positive fee included), so a bad row can never
 * quietly turn into free or underpriced online delivery.
 */
export function zoneFromRow(r: { zip: string; city: string; fee: unknown; status: unknown }): DeliveryZone {
  const fee = Math.round(Number(r.fee) * 100) / 100;
  if (r.status === "free") return { zip: r.zip, city: r.city, fee: 0, status: "free" };
  if (r.status === "fee" && Number.isFinite(fee) && fee > 0) {
    return { zip: r.zip, city: r.city, fee, status: "fee" };
  }
  return { zip: r.zip, city: r.city, fee: 0, status: "call" };
}
