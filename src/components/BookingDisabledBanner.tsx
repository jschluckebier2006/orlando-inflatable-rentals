import { AlertTriangle } from "lucide-react";
import { BOOKING_ENABLED } from "@/config/featureFlags";

export function BookingDisabledBanner() {
  if (BOOKING_ENABLED) return null;
  return (
    <div className="w-full bg-yellow-400 text-yellow-950 border-b border-yellow-500">
      <div className="container-page py-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-center">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          Booking CTAs are temporarily hidden site-wide. Set{" "}
          <code className="font-mono bg-yellow-300/70 px-1 py-0.5 rounded">BOOKING_ENABLED = true</code>{" "}
          in <code className="font-mono bg-yellow-300/70 px-1 py-0.5 rounded">src/config/featureFlags.ts</code> to re-enable.
        </span>
      </div>
    </div>
  );
}
