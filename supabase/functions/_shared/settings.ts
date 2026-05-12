// Loads live pricing + delivery zones from the database with a short in-memory cache,
// falling back to the static seeds if the DB is unreachable.
import {
  DELIVERY_ZONES as STATIC_ZONES,
  type DeliveryZone,
  type ZoneStatus,
} from "./deliveryZones.ts";

export interface AppSettings {
  taxRate: number;
  damageWaiverRate: number;
  defaultDeposit: number;
  onlineCheckoutFeeRate: number;
  zones: Record<string, DeliveryZone>;
}

const DEFAULTS: AppSettings = {
  taxRate: 0.07,
  damageWaiverRate: 0.10,
  defaultDeposit: 5,
  onlineCheckoutFeeRate: 0.04,
  zones: STATIC_ZONES,
};

let cache: { value: AppSettings; expires: number } | null = null;
const TTL_MS = 30_000; // brief cache to avoid hammering DB across hot invocations

// deno-lint-ignore no-explicit-any
export async function loadSettings(supabase: any): Promise<AppSettings> {
  if (cache && cache.expires > Date.now()) return cache.value;
  try {
    const [{ data: s }, { data: z }] = await Promise.all([
      supabase.from("app_settings").select("tax_rate,damage_waiver_rate,default_deposit,online_checkout_fee_rate").eq("id", 1).maybeSingle(),
      supabase.from("delivery_zones").select("zip,city,fee,status"),
    ]);
    const value: AppSettings = {
      taxRate: s?.tax_rate != null ? Number(s.tax_rate) : DEFAULTS.taxRate,
      damageWaiverRate: s?.damage_waiver_rate != null ? Number(s.damage_waiver_rate) : DEFAULTS.damageWaiverRate,
      defaultDeposit: s?.default_deposit != null ? Number(s.default_deposit) : DEFAULTS.defaultDeposit,
      onlineCheckoutFeeRate: s?.online_checkout_fee_rate != null ? Number(s.online_checkout_fee_rate) : DEFAULTS.onlineCheckoutFeeRate,
      zones: { ...STATIC_ZONES },
    };
    if (Array.isArray(z)) {
      for (const r of z as Array<{ zip: string; city: string; fee: number; status: string }>) {
        value.zones[r.zip] = {
          zip: r.zip,
          city: r.city,
          fee: Number(r.fee) || 0,
          status: (r.status as ZoneStatus) ?? "paid",
        };
      }
    }
    cache = { value, expires: Date.now() + TTL_MS };
    return value;
  } catch {
    return DEFAULTS;
  }
}

export function lookupZoneIn(zones: Record<string, DeliveryZone>, input: string | null | undefined): DeliveryZone | null {
  if (!input) return null;
  const zip = String(input).trim().slice(0, 5);
  if (!/^\d{5}$/.test(zip)) return null;
  return zones[zip] ?? null;
}