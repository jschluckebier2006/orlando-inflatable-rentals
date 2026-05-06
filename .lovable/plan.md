## Per-page SEO fix

**1. `index.html`** — remove the hardcoded `<title>`, `<meta name="description">`, and `<link rel="canonical">` so react-helmet-async is the single source of truth.

**2. Update `<SEOHead>` props (title, description, canonical) on each page to the exact values provided.** `SEOHead` auto-appends `| Orlando Inflatables` when missing, so titles will be passed without that suffix to avoid duplication; final rendered titles match the spec.

Category pages:
- `src/pages/BounceHouseRentals.tsx`
- `src/pages/BounceSlideComboRentals.tsx`
- `src/pages/WaterSlideRentals.tsx`
- `src/pages/ObstacleCourseRentals.tsx`
- `src/pages/InteractiveGameRentals.tsx`
- `src/pages/ConcessionRentals.tsx`
- `src/pages/TableChairRentals.tsx`

Event pages:
- `src/pages/events/BirthdayParties.tsx`
- `src/pages/events/SchoolEvents.tsx`
- `src/pages/events/ChurchEvents.tsx`
- `src/pages/events/CorporateEvents.tsx`
- `src/pages/events/GraduationEvents.tsx`

City delivery pages (update `metaTitle` + `metaDescription` props passed to `CityDeliveryPage`; canonical already derived from slug):
- `src/pages/delivery/Alafaya.tsx`
- `src/pages/delivery/AvalonPark.tsx`
- `src/pages/delivery/AzaleaPark.tsx`
- `src/pages/delivery/Bithlo.tsx`
- `src/pages/delivery/Christmas.tsx`
- `src/pages/delivery/Chuluota.tsx`
- `src/pages/delivery/Eastwood.tsx`
- `src/pages/delivery/Stoneybrook.tsx`
- `src/pages/delivery/WaterfordLakes.tsx`
- `src/pages/delivery/Wedgefield.tsx`

Other pages:
- `src/pages/Contact.tsx`
- `src/pages/DeliveryArea.tsx`

Homepage (`src/pages/Index.tsx`) is left unchanged per instruction.

No structural/component changes; head plumbing already exists via `<HelmetProvider>` in `App.tsx` and `SEOHead`.