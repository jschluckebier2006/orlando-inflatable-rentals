
- Delivery zones are three-state free/fee/call; the delivery_zones table is authoritative at runtime (non-empty DB list replaces the static seed), the two deliveryZones.ts copies stay byte-identical, and unknown or malformed ZIPs resolve to call. Why: removed ZIPs must never stay bookable, and the server must price delivery itself.
- Delivery fee is always derived server-side from the ZIP in create-booking-checkout; the browser's fee is ignored. Why: a tampered request can't skip or change the fee.
- Weekend promo UI is display-only behind WEEKEND_PROMO_UI_ACTIVE in src/config/weekendPromo.ts. Why: phone-only offer, no pricing coupling.
