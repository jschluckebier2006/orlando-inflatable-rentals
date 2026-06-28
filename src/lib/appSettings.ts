// Runtime app settings — hydrated from `app_settings` and `delivery_zones` tables on app boot.
// Falls back to compiled defaults until hydration finishes (sync code keeps working).
import { supabase } from "@/integrations/supabase/client";
import {
  DELIVERY_ZONES as STATIC_ZONES,
  type DeliveryZone,
  type ZoneStatus,
} from "@/data/deliveryZones";

interface RuntimeSettings {
  taxRate: number;
  damageWaiverRate: number;
  defaultDeposit: number;
  onlineCheckoutFeeRate: number;
  googleReviewsCount: number;
  googleRating: number;
}

const DEFAULTS: RuntimeSettings = {
  taxRate: 0.065,
  damageWaiverRate: 0.10,
  defaultDeposit: 5,
  onlineCheckoutFeeRate: 0.04,
  googleReviewsCount: 68,
  googleRating: 5.0,
};

let current: RuntimeSettings = { ...DEFAULTS };
let zonesOverlay: Record<string, DeliveryZone> = {};
let hydrated = false;
const listeners = new Set<() => void>();

export function getSettings(): RuntimeSettings {
  return current;
}

export function getRuntimeZones(): Record<string, DeliveryZone> {
  // Live DB rows win over static seeds, so admin edits show up immediately.
  return hydrated ? { ...STATIC_ZONES, ...zonesOverlay } : STATIC_ZONES;
}

export function subscribeAppSettings(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn();
}

export async function loadAppSettings(): Promise<void> {
  try {
    const [{ data: s }, { data: z }, { data: g }] = await Promise.all([
      (supabase as any).rpc("get_public_pricing").then((r: any) => ({ data: Array.isArray(r.data) ? r.data[0] : r.data })),
      (supabase.from("delivery_zones") as any).select("zip,city,fee,status"),
      (supabase as any).rpc("get_public_google_reviews").then((r: any) => ({ data: Array.isArray(r.data) ? r.data[0] : r.data })),
    ]);
    if (s) {
      current = {
        ...current,
        taxRate: Number(s.tax_rate) || DEFAULTS.taxRate,
        damageWaiverRate: Number(s.damage_waiver_rate) || DEFAULTS.damageWaiverRate,
        defaultDeposit: Number(s.default_deposit) || DEFAULTS.defaultDeposit,
        onlineCheckoutFeeRate: Number(s.online_checkout_fee_rate) || DEFAULTS.onlineCheckoutFeeRate,
      };
    }
    if (g && g.reviews_count != null) {
      current = {
        ...current,
        googleReviewsCount: Number(g.reviews_count) || DEFAULTS.googleReviewsCount,
        googleRating: Number(g.rating) || DEFAULTS.googleRating,
      };
    }
    if (Array.isArray(z)) {
      const map: Record<string, DeliveryZone> = {};
      for (const r of z as Array<{ zip: string; city: string; fee: number; status: string }>) {
        map[r.zip] = {
          zip: r.zip,
          city: r.city,
          fee: Number(r.fee) || 0,
          status: (r.status as ZoneStatus) ?? "paid",
        };
      }
      zonesOverlay = map;
    }
    hydrated = true;
    emit();
  } catch {
    // Keep defaults silently — pages still render.
  }
}