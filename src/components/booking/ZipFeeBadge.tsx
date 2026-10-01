import { CheckCircle2 } from "lucide-react";
import { lookupZone } from "@/data/deliveryZones";

/**
 * Inline badge under the ZIP input. Only two outcomes exist:
 *   - green "Free delivery to {City}"
 *   - nothing (call/text ZIPs are handled by the blocking message in CheckoutModal)
 */
export function ZipFeeBadge({ zip }: { zip: string }) {
  const trimmed = (zip ?? "").trim();
  if (!/^\d{5}/.test(trimmed)) return null;
  const zone = lookupZone(trimmed);
  if (!zone || zone.status !== "free") return null;
  return (
    <div className="mt-1 flex items-center gap-2 rounded-md border border-green-600/30 bg-green-600/10 p-2 text-xs text-green-800 dark:text-green-300">
      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
      <span><strong>Free delivery</strong> to {zone.city}</span>
    </div>
  );
}
