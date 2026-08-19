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

export {};