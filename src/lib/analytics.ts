/** Thin, safe wrapper around GA4 (gtag.js is loaded in index.html). */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {
    /* analytics must never break the UI */
  }
}

export const RESERVE_PHONE = "407-497-1840";
export const RESERVE_PHONE_HREF = "tel:+14074971840";

export function trackCallToReserve(product: { slug: string; name: string }) {
  trackEvent("call_to_reserve", {
    product_slug: product.slug,
    product_name: product.name,
    phone: RESERVE_PHONE,
  });
}

/* ------------------------------------------------------------------ */
/* Google Ads conversions (AW-725651337) + matching GA4 events.        */
/* Every call is guarded: if gtag is missing or throws, nothing happens. */
/* ------------------------------------------------------------------ */

export const GA4_ID = "G-CSD46XS8PZ";
export const ADS_ID = "AW-725651337";
export const ADS_SEND_TO = {
  booking: `${ADS_ID}/OCzCCMGzz7YdEImfgtoC`,
  deliveryRequest: `${ADS_ID}/Vf4bCMSzz7YdEImfgtoC`,
  callTextTap: `${ADS_ID}/kgTACMezz7YdEImfgtoC`,
} as const;

function safeGtag(...args: unknown[]) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag(...args);
    }
  } catch {
    /* never break the UI */
  }
  if (import.meta.env.DEV) {
    try { console.info("[tracking]", ...args); } catch { /* ignore */ }
  }
}

function isAdminPath(): boolean {
  try {
    return typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  } catch {
    return false;
  }
}

/** Online booking (deposit paid). Fires once per booking id. */
export function trackBookingConversion(bookingId: string | null | undefined) {
  if (!bookingId || isAdminPath()) return;
  const key = `aw_booking_conv_${bookingId}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
  } catch { /* storage blocked: rely on transaction_id dedupe */ }
  safeGtag("event", "conversion", {
    send_to: ADS_SEND_TO.booking,
    value: 5.0,
    currency: "USD",
    transaction_id: bookingId,
  });
  safeGtag("event", "booking_complete", {
    send_to: GA4_ID,
    value: 5.0,
    currency: "USD",
    transaction_id: bookingId,
  });
  try { window.sessionStorage.setItem(key, "1"); } catch { /* ignore */ }
}

/** Delivery request saved (call / out-of-area ZIP form). */
export function trackDeliveryRequestConversion() {
  if (isAdminPath()) return;
  safeGtag("event", "conversion", {
    send_to: ADS_SEND_TO.deliveryRequest,
    value: 3.0,
    currency: "USD",
  });
  safeGtag("event", "delivery_request", { send_to: GA4_ID, value: 3.0, currency: "USD" });
}

/**
 * One document-level listener for every tel:/sms: link on the public site.
 * Passive: never prevents or delays the link. Returns a cleanup function.
 */
export function installCallTextTapTracking(): () => void {
  if (typeof document === "undefined") return () => {};
  const onClick = (e: MouseEvent) => {
    try {
      if (isAdminPath()) return;
      const target = e.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = (link.getAttribute("href") || "").trim().toLowerCase();
      const linkType = href.startsWith("tel:") ? "tel" : href.startsWith("sms:") ? "sms" : null;
      if (!linkType) return;
      safeGtag("event", "conversion", {
        send_to: ADS_SEND_TO.callTextTap,
        value: 2.0,
        currency: "USD",
      });
      safeGtag("event", "call_text_tap", {
        send_to: GA4_ID,
        link_type: linkType,
        value: 2.0,
        currency: "USD",
      });
    } catch {
      /* never block the link */
    }
  };
  document.addEventListener("click", onClick, { capture: true, passive: true });
  return () => document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
}

export {};