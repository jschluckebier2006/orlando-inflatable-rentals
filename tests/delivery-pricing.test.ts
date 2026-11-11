// Delivery zone + pricing rules. Run with: bun test tests/
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { cardPctFromAmounts, computeBreakdown, formatTaxPct } from "../supabase/functions/_shared/pricing.ts";
import {
  DELIVERY_ZONES,
  deliveryFeeForZone,
  isZoneBookableOnline,
  lookupZoneIn,
  zoneFromRow,
} from "../supabase/functions/_shared/deliveryZones.ts";
import { getCityDelivery } from "../src/data/serviceAreas.ts";

const RATES = { taxRate: 0.065, waiverRate: 0.10, checkoutFeeRate: 0.03 };
const zone = (zip: string) => lookupZoneIn(DELIVERY_ZONES, zip);

describe("ZIP list", () => {
  test("has 59 ZIPs: 35 free, 18 fee, 6 call", () => {
    const all = Object.values(DELIVERY_ZONES);
    expect(all.length).toBe(59);
    expect(all.filter((z) => z.status === "free").length).toBe(35);
    expect(all.filter((z) => z.status === "fee").length).toBe(18);
    expect(all.filter((z) => z.status === "call").length).toBe(6);
  });

  test("every fee ZIP charges $50; free and call ZIPs charge $0", () => {
    for (const z of Object.values(DELIVERY_ZONES)) {
      expect(deliveryFeeForZone(z)).toBe(z.status === "fee" ? 50 : 0);
    }
  });

  test("browser and server copies are byte-identical", () => {
    const a = readFileSync(new URL("../src/data/deliveryZones.ts", import.meta.url), "utf8");
    const b = readFileSync(new URL("../supabase/functions/_shared/deliveryZones.ts", import.meta.url), "utf8");
    expect(a).toBe(b);
  });

  test("32803 free, 34786 fee $50, 32839 free, 34711 call", () => {
    expect(zone("32803")?.status).toBe("free");
    expect(deliveryFeeForZone(zone("34786"))).toBe(50);
    expect(zone("32839")?.status).toBe("free");
    expect(zone("34711")?.status).toBe("call");
    expect(isZoneBookableOnline(zone("34711"))).toBe(false);
  });

  test("an unlisted ZIP is call: not bookable online, no fee", () => {
    expect(zone("33801")).toBeNull();
    expect(isZoneBookableOnline(zone("33801"))).toBe(false);
    expect(deliveryFeeForZone(zone("33801"))).toBe(0);
  });

  test("a bad database row falls back to call, never free or fee", () => {
    expect(zoneFromRow({ zip: "11111", city: "X", fee: 0, status: "fee" }).status).toBe("call");
    expect(zoneFromRow({ zip: "11111", city: "X", fee: 50, status: "paid" }).status).toBe("call");
  });
});

describe("pricing for one $209 Day Rental with damage waiver", () => {
  test("free ZIP, cash on delivery: $244.84", () => {
    const bd = computeBreakdown(209, true, 0, RATES, "cash_on_delivery");
    expect(bd.damageWaiver).toBe(20.9);
    expect(bd.tax).toBe(14.94);
    expect(bd.total).toBe(244.84);
  });

  test("$50 fee ZIP: waiver and tax ignore the delivery fee", () => {
    const bd = computeBreakdown(209, true, 50, RATES, "cash_on_delivery");
    expect(bd.damageWaiver).toBe(20.9); // 10% of $209 only
    expect(bd.tax).toBe(14.94);         // 6.5% of $229.90 only
    expect(bd.total).toBe(294.84);
  });

  test("free ZIP: card price $252.19, cash $244.84, cash saves $7.35", () => {
    const card = computeBreakdown(209, true, 0, RATES, "card_on_file");
    const cash = computeBreakdown(209, true, 0, RATES, "cash_on_delivery");
    expect(card.total).toBe(252.19);
    expect(cash.total).toBe(244.84);
    expect(card.checkoutFee).toBe(7.35);
  });

  test("$50 fee ZIP: card price is 3% over the cash total including delivery", () => {
    const bd = computeBreakdown(209, true, 50, RATES, "card_on_file");
    expect(bd.checkoutFee).toBe(8.85); // 3% of $294.84
    expect(bd.total).toBe(303.69);
  });
});

describe("Card price rate", () => {
  test("code defaults are 3% in both settings files", () => {
    for (const f of ["src/lib/appSettings.ts", "supabase/functions/_shared/settings.ts"]) {
      expect(readFileSync(f, "utf8")).toMatch(/onlineCheckoutFeeRate: 0\.03,/);
    }
  });
  test("saved bookings read back the percent they were priced at", () => {
    expect(cardPctFromAmounts(7.35, 252.19)).toBe("3%");
    expect(cardPctFromAmounts(11.79, 306.63)).toBe("4%"); // older 4% booking
  });
  test("customers never see 'convenience fee' or 'surcharge'", () => {
    for (const f of [
      "supabase/functions/_shared/email.ts",
      "src/components/cart/CartDrawer.tsx",
      "src/components/booking/CheckoutModal.tsx",
      "src/components/booking/PaymentStep.tsx",
      "src/components/admin/BookingFormModal.tsx",
      "src/pages/CheckoutReturn.tsx",
      "src/pages/FAQ.tsx",
      "src/pages/TermsOfService.tsx",
    ]) {
      expect(readFileSync(f, "utf8")).not.toMatch(/convenience fee|surcharge/i);
    }
  });
});

describe("city page delivery status", () => {
  test("Bithlo and Christmas are free, Sanford is $50, Kissimmee and unknown cities are call", () => {
    expect(getCityDelivery("Bithlo").status).toBe("free");
    expect(getCityDelivery("Christmas").status).toBe("free");
    expect(getCityDelivery("Sanford")).toEqual({ status: "fee", fee: 50 });
    expect(getCityDelivery("Kissimmee").status).toBe("call");
    expect(getCityDelivery("Nowhere").status).toBe("call");
  });
});

describe("Sales tax label", () => {
  test("shows the configured rate: 6.5% today", () => {
    expect(formatTaxPct(0.065)).toBe("6.5%");
  });
  test("follows a changed rate", () => {
    expect(formatTaxPct(0.07)).toBe("7%");
    expect(formatTaxPct(0.0675)).toBe("6.75%");
  });
  test("no email or screen hard-codes the tax percent", () => {
    for (const f of [
      "supabase/functions/_shared/email.ts",
      "src/components/booking/CheckoutModal.tsx",
      "src/components/booking/PaymentStep.tsx",
      "src/components/admin/BookingFormModal.tsx",
    ]) {
      expect(readFileSync(f, "utf8")).not.toMatch(/Sales Tax \(\d/);
    }
  });
});
