// Google Ads conversion rules. Run with: bun test tests/
import { beforeEach, describe, expect, test } from "bun:test";

type Call = unknown[];
let calls: Call[] = [];
let listener: ((e: any) => void) | null = null;
const store = new Map<string, string>();

function setPath(pathname: string) {
  (globalThis as any).window.location.pathname = pathname;
}

beforeEach(() => {
  calls = [];
  store.clear();
  (globalThis as any).window = {
    gtag: (...args: unknown[]) => calls.push(args),
    location: { pathname: "/" },
    sessionStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
    },
  };
  (globalThis as any).document = {
    addEventListener: (_t: string, fn: any) => { listener = fn; },
    removeEventListener: () => { listener = null; },
  };
});

const { trackBookingConversion, trackDeliveryRequestConversion, installCallTextTapTracking } =
  await import("../src/lib/analytics.ts");

const adsConversions = () => calls.filter((c) => c[0] === "event" && c[1] === "conversion");
const clickOn = (href: string) => listener?.({ target: { closest: () => ({ getAttribute: () => href }) } });

describe("booking conversion", () => {
  test("fires once per booking id with value 5 USD and the booking id", () => {
    trackBookingConversion("bk-123");
    trackBookingConversion("bk-123");
    const conv = adsConversions();
    expect(conv.length).toBe(1);
    expect(conv[0][2]).toEqual({
      send_to: "AW-725651337/OCzCCMGzz7YdEImfgtoC", value: 5, currency: "USD", transaction_id: "bk-123",
    });
    expect(calls.some((c) => c[1] === "booking_complete")).toBe(true);
  });
  test("never fires on admin pages", () => {
    setPath("/admin/bookings");
    trackBookingConversion("bk-999");
    expect(adsConversions().length).toBe(0);
  });
  test("does nothing and never throws when gtag is missing", () => {
    delete (globalThis as any).window.gtag;
    expect(() => trackBookingConversion("bk-1")).not.toThrow();
  });
});

describe("delivery request conversion", () => {
  test("sends value 3 USD to the delivery request label", () => {
    trackDeliveryRequestConversion();
    expect(adsConversions()[0][2]).toEqual({
      send_to: "AW-725651337/Vf4bCMSzz7YdEImfgtoC", value: 3, currency: "USD",
    });
  });
});

describe("call/text tap conversion", () => {
  test("tel: and sms: links fire value 2 USD, other links don't", () => {
    installCallTextTapTracking();
    clickOn("tel:4074971840");
    clickOn("sms:4074971840");
    clickOn("/rentals");
    const conv = adsConversions();
    expect(conv.length).toBe(2);
    expect(conv[0][2]).toEqual({ send_to: "AW-725651337/kgTACMezz7YdEImfgtoC", value: 2, currency: "USD" });
    const types = calls.filter((c) => c[1] === "call_text_tap").map((c: any) => c[2].link_type);
    expect(types).toEqual(["tel", "sms"]);
  });
  test("does not fire on admin pages", () => {
    installCallTextTapTracking();
    setPath("/admin");
    clickOn("tel:4074971840");
    expect(adsConversions().length).toBe(0);
  });
});
