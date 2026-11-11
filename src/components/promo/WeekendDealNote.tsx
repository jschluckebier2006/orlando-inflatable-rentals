import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { WEEKEND_PROMO_UI_ACTIVE, PROMO_NAME } from "@/config/weekendPromo";

/**
 * "Want Sunday free?" note shown next to rental-length choices.
 * DISPLAY ONLY — the Weekend Deal is booked by phone/text; no pricing here.
 */
export function WeekendDealNote({ className, source }: { className?: string; source: string }) {
  if (!WEEKEND_PROMO_UI_ACTIVE) return null;
  return (
    <p
      className={cn(
        "rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-foreground",
        className,
      )}
      data-testid="weekend-deal-note"
    >
      <span className="font-semibold">Want Sunday free?</span> Book your Saturday by phone or text at{" "}
      <a
        href="tel:4074971840"
        onClick={() => trackEvent("promo_note_call", { promo_name: PROMO_NAME, source })}
        className="font-semibold text-primary underline underline-offset-2"
      >
        (407) 497-1840
      </a>{" "}
      <a
        href="sms:4074971840"
        onClick={() => trackEvent("promo_note_text", { promo_name: PROMO_NAME, source })}
        className="inline-flex items-center gap-0.5 font-semibold text-primary underline underline-offset-2"
        aria-label="Text (407) 497-1840"
      >
        <MessageSquare className="h-3 w-3" aria-hidden="true" />Text
      </a>{" "}
      and mention 'Weekend Deal.' Subject to availability; exclusions apply.
    </p>
  );
}
