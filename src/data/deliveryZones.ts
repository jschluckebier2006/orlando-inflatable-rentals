// =====================================================================
// Orlando Inflatables — Delivery zones, by ZIP code.
// Single source of truth. To change a fee, just edit the matching row.
// status:
//   "free" — no delivery fee charged
//   "paid" — `fee` is added to the order, taxed with the rental
//   "call" — online booking blocked; customer is prompted to phone us
// =====================================================================

export type ZoneStatus = "free" | "paid" | "call";

export interface DeliveryZone {
  zip: string;
  city: string;
  fee: number;
  status: ZoneStatus;
}

export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  // Central Orlando — free
  "32801": { zip: "32801", city: "Orlando", fee: 0, status: "free" },
  "32803": { zip: "32803", city: "Orlando", fee: 0, status: "free" },
  "32804": { zip: "32804", city: "Orlando", fee: 0, status: "free" },
  "32805": { zip: "32805", city: "Orlando", fee: 0, status: "free" },
  "32806": { zip: "32806", city: "Orlando", fee: 0, status: "free" },
  "32807": { zip: "32807", city: "Azalea Park", fee: 0, status: "free" },
  "32808": { zip: "32808", city: "Orlando", fee: 0, status: "free" },
  "32809": { zip: "32809", city: "Orlando", fee: 0, status: "free" },
  "32811": { zip: "32811", city: "Orlando", fee: 0, status: "free" },
  "32812": { zip: "32812", city: "Orlando", fee: 0, status: "free" },
  "32814": { zip: "32814", city: "Baldwin Park", fee: 0, status: "free" },
  "32817": { zip: "32817", city: "Orlando", fee: 0, status: "free" },
  "32818": { zip: "32818", city: "Orlando", fee: 0, status: "free" },
  "32822": { zip: "32822", city: "Orlando", fee: 0, status: "free" },
  "32824": { zip: "32824", city: "Orlando", fee: 0, status: "free" },
  "32825": { zip: "32825", city: "Orlando", fee: 0, status: "free" },
  "32826": { zip: "32826", city: "Alafaya", fee: 0, status: "free" },
  "32827": { zip: "32827", city: "Orlando / Lake Nona", fee: 0, status: "free" },
  "32829": { zip: "32829", city: "Alafaya", fee: 0, status: "free" },
  "32831": { zip: "32831", city: "Orlando", fee: 0, status: "free" },
  "32833": { zip: "32833", city: "Wedgefield", fee: 0, status: "free" },
  "32835": { zip: "32835", city: "Orlando", fee: 0, status: "free" },
  "32837": { zip: "32837", city: "Orlando", fee: 0, status: "free" },

  // Winter Park / Aloma / Goldenrod / Casselberry — free
  "32733": { zip: "32733", city: "Goldenrod", fee: 0, status: "free" },
  "32789": { zip: "32789", city: "Winter Park", fee: 0, status: "free" },
  "32792": { zip: "32792", city: "Aloma / Winter Park", fee: 0, status: "free" },
  "32707": { zip: "32707", city: "Casselberry", fee: 0, status: "free" },

  // Altamonte Springs — free
  "32701": { zip: "32701", city: "Altamonte Springs", fee: 0, status: "free" },
  "32714": { zip: "32714", city: "Altamonte Springs", fee: 0, status: "free" },

  // Chuluota / Oviedo — free (drive-time exception)
  "32765": { zip: "32765", city: "Oviedo", fee: 0, status: "free" },
  "32766": { zip: "32766", city: "Chuluota", fee: 0, status: "free" },

  // Paid zones — $50
  "32819": { zip: "32819", city: "Orlando / Doctor Phillips", fee: 50, status: "paid" },
  "32828": { zip: "32828", city: "Avalon Park / Waterford Lakes", fee: 50, status: "paid" },
  "32832": { zip: "32832", city: "Lake Nona", fee: 50, status: "paid" },

  // Paid zones — $75
  "32708": { zip: "32708", city: "Winter Springs", fee: 75, status: "paid" },
  "32836": { zip: "32836", city: "Orlando / Doctor Phillips", fee: 75, status: "paid" },
  "34761": { zip: "34761", city: "Ocoee", fee: 75, status: "paid" },
  "34786": { zip: "34786", city: "Windermere", fee: 75, status: "paid" },

  // Call to book — manual quote required
  "32709": { zip: "32709", city: "Christmas", fee: 0, status: "call" },
  "32820": { zip: "32820", city: "Bithlo", fee: 0, status: "call" },
};

import { getRuntimeZones } from "@/lib/appSettings";

/** Look up a zone by raw user input (handles ZIP+4, whitespace, etc.). */
export function lookupZone(input: string | null | undefined): DeliveryZone | null {
  if (!input) return null;
  const zip = String(input).trim().slice(0, 5);
  if (!/^\d{5}$/.test(zip)) return null;
  // Runtime DB overlay wins over static seeds; falls back to static while hydrating.
  return getRuntimeZones()[zip] ?? null;
}

/** True if the given zip can be booked online (i.e. not call-only and not unknown). */
export function isOnlineBookable(input: string | null | undefined): boolean {
  const z = lookupZone(input);
  return !!z && z.status !== "call";
}