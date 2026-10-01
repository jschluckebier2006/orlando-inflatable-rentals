import { useEffect, useState } from "react";
import { Phone, MessageSquare, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  WEEKEND_PROMO_UI_ACTIVE, PROMO_NAME, PROMO_TEL, PROMO_SMS,
  isBarDismissed, markBarDismissed,
} from "@/config/weekendPromo";

// Module-level so it survives page navigation (Layout remounts per route).
let shownThisSession = false;

/** Slim promo strip rendered as the first row inside the sticky site header. */
export function WeekendPromoBar() {
  const [visible, setVisible] = useState(shownThisSession);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!WEEKEND_PROMO_UI_ACTIVE || isBarDismissed() || shownThisSession) return;
    const t = window.setTimeout(() => {
      if (isBarDismissed()) return;
      shownThisSession = true;
      setAnimate(true);
      setVisible(true);
      trackEvent("promo_bar_view", { promo_name: PROMO_NAME });
    }, 2000);
    return () => window.clearTimeout(t);
  }, []);

  if (!WEEKEND_PROMO_UI_ACTIVE || !visible) return null;

  const dismiss = () => {
    trackEvent("promo_bar_dismiss", { promo_name: PROMO_NAME });
    markBarDismissed();
    shownThisSession = false;
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Weekend promotion"
      className={`bg-primary text-primary-foreground ${animate ? "animate-promo-slide-down" : ""}`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="container-page flex items-center gap-2 py-1.5 text-sm">
        <p className="flex-1 min-w-0 font-semibold leading-tight">
          <span className="hidden sm:inline">Limited time — Book Saturday, Get Sunday FREE</span>
          <span className="sm:hidden">Book Saturday, Get Sunday FREE</span>
        </p>
        <a
          href={PROMO_TEL}
          onClick={() => trackEvent("promo_bar_call", { promo_name: PROMO_NAME })}
          className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-3 py-1 font-semibold min-h-[32px] hover:opacity-90"
        >
          <Phone className="h-3.5 w-3.5" />Call
        </a>
        <a
          href={PROMO_SMS}
          onClick={() => trackEvent("promo_bar_text", { promo_name: PROMO_NAME })}
          className="inline-flex items-center gap-1 rounded-full border border-primary-foreground/60 px-3 py-1 font-semibold min-h-[32px] hover:bg-primary-foreground/10"
        >
          <MessageSquare className="h-3.5 w-3.5" />Text
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss promotion"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary-foreground/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
