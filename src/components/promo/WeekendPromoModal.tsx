import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Check, Phone, MessageSquare, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import {
  WEEKEND_PROMO_UI_ACTIVE, PROMO_NAME, PROMO_TEL, PROMO_SMS, PROMO_PHONE_DISPLAY,
  BAR_DISMISSED_EVENT, isBarDismissed, isModalRecentlySeen, markModalSeen, isExcludedPath,
} from "@/config/weekendPromo";

/** Timed "Book Saturday, Get Sunday FREE" popup. Display only — phone/text bookings. */
export function WeekendPromoModal() {
  const { pathname } = useLocation();
  const { items, isCheckoutOpen } = useCart();
  const [open, setOpen] = useState(false);
  const done = useRef(false); // fired or cancelled for this page load

  // Latest values for the suppression check at fire time.
  const live = useRef({ pathname, itemCount: items.length, isCheckoutOpen });
  live.current = { pathname, itemCount: items.length, isCheckoutOpen };

  const suppressed = () =>
    isBarDismissed() ||
    isModalRecentlySeen() ||
    live.current.isCheckoutOpen ||
    live.current.itemCount > 0 ||
    isExcludedPath(live.current.pathname) ||
    live.current.pathname.startsWith("/admin");

  const tryOpen = useCallback(() => {
    if (done.current) return;
    if (suppressed()) return;
    done.current = true;
    markModalSeen();
    setOpen(true);
    trackEvent("promo_modal_view", { promo_name: PROMO_NAME });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!WEEKEND_PROMO_UI_ACTIVE) return;
    const timer = window.setTimeout(tryOpen, 15000);
    const onLeave = (e: MouseEvent) => {
      if (window.innerWidth >= 768 && e.clientY <= 0 && !e.relatedTarget) tryOpen();
    };
    const onBarDismiss = () => { done.current = true; window.clearTimeout(timer); };
    document.addEventListener("mouseout", onLeave);
    window.addEventListener(BAR_DISMISSED_EVENT, onBarDismiss);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener(BAR_DISMISSED_EVENT, onBarDismiss);
    };
  }, [tryOpen]);

  // Never sit on top of the reservation flow.
  useEffect(() => { if (isCheckoutOpen) setOpen(false); }, [isCheckoutOpen]);

  const close = useCallback(() => {
    setOpen(false);
    trackEvent("promo_modal_dismiss", { promo_name: PROMO_NAME });
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!WEEKEND_PROMO_UI_ACTIVE || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="weekend-promo-title"
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-card text-card-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground hover:bg-primary-foreground/15"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-primary text-primary-foreground text-center py-2.5 text-xs font-bold tracking-widest">
          LIMITED TIME OFFER
        </div>
        <div className="px-5 py-5 sm:px-6 text-center space-y-4">
          <h2 id="weekend-promo-title" className="font-display text-3xl font-extrabold leading-tight text-foreground">
            Book Saturday,<br />Get Sunday <span className="text-secondary">FREE</span>
          </h2>
          <p className="text-muted-foreground">
            Keep your inflatable the whole weekend at no extra charge. Same price, double the party.
          </p>
          <ul className="text-left space-y-2 text-sm text-foreground">
            {[
              "Saturday delivery through Sunday pickup",
              "Book any upcoming Saturday — not just this weekend",
              "We'll confirm your date on the spot",
            ].map((t) => (
              <li key={t} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{t}</li>
            ))}
          </ul>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs font-bold tracking-wider text-primary">CALL OR TEXT TO CLAIM</p>
            <a href={PROMO_TEL} onClick={() => trackEvent("promo_modal_call", { promo_name: PROMO_NAME })}
              className="block font-display text-3xl font-extrabold text-foreground hover:text-primary">
              {PROMO_PHONE_DISPLAY}
            </a>
          </div>
          <p className="text-sm font-semibold text-foreground">
            Phone and text bookings only — this offer isn't available online.
            Mention "Weekend Deal" when you reach out.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a href={PROMO_TEL} onClick={() => trackEvent("promo_modal_call", { promo_name: PROMO_NAME })}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary text-secondary-foreground font-bold py-3 hover:opacity-90">
              <Phone className="h-4 w-4" />Call Now
            </a>
            <a href={PROMO_SMS} onClick={() => trackEvent("promo_modal_text", { promo_name: PROMO_NAME })}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-bold py-3 hover:opacity-90">
              <MessageSquare className="h-4 w-4" />Send a Text
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Subject to availability. Exclusions apply. Offer may end at any time.
          </p>
          <button type="button" onClick={close} className="text-sm text-muted-foreground underline hover:text-foreground">
            No thanks, maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
