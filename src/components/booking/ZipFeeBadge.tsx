import { CheckCircle2, Truck, PhoneCall } from "lucide-react";
import { lookupZone } from "@/data/deliveryZones";

/**
 * Inline status badge that appears under the ZIP input on the checkout form.
 * Shows one of:
 *   - green "Free delivery to {City}"
 *   - blue  "{City} delivery fee: $X"
 *   - red   "We can't book this zip online — call (407) 497-1840"
 * Returns null while the user is still typing (< 5 digits).
 */
export function ZipFeeBadge({ zip }: { zip: string }) {
  const trimmed = (zip ?? "").trim();
  // Don't show anything until they've typed a full 5-digit zip.
  if (!/^\d{5}/.test(trimmed)) return null;
  const zone = lookupZone(trimmed);

  if (!zone) {
    return (
      <div
        role="alert"
        className="mt-1 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive"
      >
        <PhoneCall className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>
          Please call{" "}
          <a href="tel:+14074971840" className="font-semibold underline">(407) 497-1840</a>{" "}
          to book — online booking is not available for this ZIP.
        </span>
      </div>
    );
  }

  if (zone.status === "call") {
    return (
      <div
        role="alert"
        className="mt-1 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive"
      >
        <PhoneCall className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>
          {zone.city} requires a phone quote. Please call{" "}
          <a href="tel:4074971840" className="font-semibold underline">(407) 497-1840</a>{" "}
          to book this area.
        </span>
      </div>
    );
  }

  if (zone.fee === 0) {
    return (
      <div className="mt-1 flex items-center gap-2 rounded-md border border-green-600/30 bg-green-600/10 p-2 text-xs text-green-800 dark:text-green-300">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span><strong>Free delivery</strong> to {zone.city}</span>
      </div>
    );
  }

  return (
    <div className="mt-1 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 p-2 text-xs text-primary">
      <Truck className="h-3.5 w-3.5 shrink-0" />
      <span>
        Delivery to <strong>{zone.city}</strong>: <strong>${zone.fee.toFixed(2)}</strong>
      </span>
    </div>
  );
}