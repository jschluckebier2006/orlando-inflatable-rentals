# Sitewide schema cleanup

Rich Results Test on the Bithlo page shows two business entries. The per-city one ("Orlando Inflatables - Bithlo") is clean. The sitewide one is missing fields.

## 1. What the live site actually has (verified before planning)

- **Homepage LocalBusiness node** (`@id: https://orlandoinflatables.com/#organization`): already has telephone, image, priceRange, and a city-level address. Nothing to add.
- **Sitewide Organization node**: has telephone and a city-level address, but is **missing `image` and `priceRange`** — confirmed by fetching the live homepage. This is the node to fix.
- **Per-city LocalBusiness nodes**: already carry telephone, image, priceRange, and the city-level address — they are not affected by this change and stay as they are.
- The live published site is behind the preview: the live Bithlo page still says "Free delivery and setup included" instead of the new call-or-text wording, and its per-city schema ID is broken (see section 3). Google's tester may also have read a cached older copy — the current source already includes telephone on both nodes.

## 2. Add the three fields to the sitewide Organization schema

In `src/components/seo/OrganizationSchema.tsx`:

- `telephone`: `+1-407-497-1840` — already present; leave untouched (verified).
- `image`: `https://orlandoinflatables.com/logo.png` — **add** (absolute URL; the existing `logo` field alone doesn't satisfy the `image` recommendation).
- `priceRange`: `"$$"` — **add**.
- `address`: **do not add anything.** The existing city-level PostalAddress (Orlando, FL 32828 — no street line) stays exactly as it is. No street address is published anywhere, on purpose, for this service-area business. The missing-address warning is accepted and will remain.

## 3. One extra fix found while in these files (small, schema-only)

The 20 city-service pages render the per-city schema without the city slug, so the live pages currently emit `@id: https://orlandoinflatables.com/#undefined-location`. One-line change in `src/components/templates/CityServicePage.tsx`: pass `citySlug={citySlug}` to `LocalBusinessSchema`, matching how `CityDeliveryPage.tsx` already does it. Per-city entries then get a stable ID like `/#bithlo-location`.

## 4. Verification

- Build check passes.
- Preview check: fetch the rendered HTML of the homepage and the Bithlo bounce-house page and confirm the Organization node carries image + priceRange, the sitewide LocalBusiness is unchanged and complete, and the per-city node has the corrected ID and all four fields.
- Note for the user: the live published site still shows the older wording and old schema; republishing (the Publish button) is what pushes all of this live. The missing-address warning will remain by design.

Nothing else changes — no meta descriptions, no visible copy, no pricing.
