// Weekend promo UI — "Book Saturday, Get Sunday FREE".
// DISPLAY ONLY: phone/text bookings only. Touches no pricing anywhere.
// Set to false to remove both the top promo bar and the timed popup.
export const WEEKEND_PROMO_UI_ACTIVE = true;

export const PROMO_NAME = "book_saturday_get_sunday_free";
export const PROMO_PHONE_DISPLAY = "(407) 497-1840";
export const PROMO_TEL = "tel:+14074971840";
export const PROMO_SMS = "sms:+14074971840";

const BAR_KEY = "oi_promo_bar_dismissed";
const MODAL_KEY = "oi_promo_modal_seen";
const BAR_DAYS = 30;
const MODAL_DAYS = 7;
export const BAR_DISMISSED_EVENT = "oi-promo-bar-dismissed";

function readTs(key: string): number | null {
  try {
    const v = window.localStorage.getItem(key);
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}
function writeNow(key: string) {
  try {
    window.localStorage.setItem(key, String(Date.now()));
  } catch {
    /* private browsing — ignore */
  }
}
const within = (ts: number | null, days: number) => ts != null && Date.now() - ts < days * 86400000;

export const isBarDismissed = () => within(readTs(BAR_KEY), BAR_DAYS);
export const markBarDismissed = () => {
  writeNow(BAR_KEY);
  try { window.dispatchEvent(new Event(BAR_DISMISSED_EVENT)); } catch { /* noop */ }
};
export const isModalRecentlySeen = () => within(readTs(MODAL_KEY), MODAL_DAYS);
export const markModalSeen = () => writeNow(MODAL_KEY);

export const PROMO_EXCLUDED_PATHS = ["/cart", "/checkout", "/thank-you"];
export const isExcludedPath = (p: string) =>
  PROMO_EXCLUDED_PATHS.some((x) => p === x || p.startsWith(x + "/"));
