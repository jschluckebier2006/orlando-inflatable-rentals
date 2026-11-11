import { CheckCircle2, Truck } from "lucide-react";
import { lookupZone } from "@/lib/appSettings";
import { deliveryFeeForZone } from "@/data/deliveryZones";

/**
 * Inline note under the ZIP input:
 *   - "free" ZIP → green "Free delivery to {City}"
 *   - "fee" ZIP  → "Delivery to {City}: $50"
 *   - call / unknown ZIPs show nothing here (CheckoutModal shows the request panel)
 */
export function ZipFeeBadge({ zip }: { zip: string }) {
  const trimmed = (zip ?? "").trim();
  if (!/^\d{5}/.test(trimmed)) return null;
  const zone = lookupZone(trimmed);
  if (!zone) return null;
  if (zone.status === "free") {
    return (
      <div className="mt-1 flex items-center gap-2 rounded-md border border-green-600/30 bg-green-600/10 p-2 text-xs text-green-800 dark:text-green-300">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span><strong>Free delivery</strong> to {zone.city}</span>
      </div>
    );
  }
  if (zone.status === "fee") {
    const fee = deliveryFeeForZone(zone);
    return (
      <div className="mt-1 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 p-2 text-xs text-foreground">
        <Truck className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span>Delivery to {zone.city}: <strong>${Number.isInteger(fee) ? fee : fee.toFixed(2)}</strong></span>
      </div>
    );
  }
  return null;
}
