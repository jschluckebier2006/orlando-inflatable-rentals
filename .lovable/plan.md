

# Add Service Area Header + Trust Badge Row

## FIX 1 — Add city-level service area header

**File:** `src/components/home/DeliveryAreasSection.tsx`

Insert a prominent service area statement **above** the existing neighborhood grid. All current neighborhood data (Alafaya, Avalon Park, etc.) stays exactly as-is.

### Placement
Between the section header block (`text-center mb-12`) and the existing neighborhoods grid.

### Markup
```tsx
{/* Primary Service Area Statement */}
<div className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-5 mb-10 text-center">
  <p className="text-base md:text-lg font-semibold text-foreground">
    <span className="text-primary font-bold">We serve:</span>{" "}
    Orlando · Winter Park · Kissimmee · Apopka · Sanford · Cocoa · Cocoa Beach
    <span className="text-muted-foreground font-normal"> · and surrounding areas</span>
  </p>
</div>

{/* Sub-label for the existing neighborhood chips */}
<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center mb-4">
  East Orlando Neighborhoods
</h3>
```

### Visual hierarchy
- City row: larger, bolder, primary-tinted pill — reads as the headline
- Neighborhood chips: existing styling untouched, now grouped under a small "East Orlando Neighborhoods" sub-label so the two tiers read clearly

---

## FIX 2 — Trust badge row in hero/welcome whitespace

**File:** `src/pages/Index.tsx`

Insert a new lightweight inline trust badge row **between** `<HeroSection />` and `<CategoriesSection />` (the "Welcome to Orlando Inflatables" section is part of `SEOContentSection` further down, but `CategoriesSection` is what immediately follows the hero — confirmed during plan exploration; the gap referenced is the band between hero and the first content section).

Created as a small inline component (no new file needed — kept inline in `Index.tsx` for scope tightness, OR extracted to `src/components/home/TrustBadgesRow.tsx` for cleanliness).

### Recommended: new file `src/components/home/TrustBadgesRow.tsx`

```tsx
import { Shield, Zap, Award } from "lucide-react";

const badges = [
  { icon: Shield, label: "Fully Insured" },
  { icon: Zap, label: "Same-Day Response" },
  { icon: Award, label: "5-Star Rated on Google" },
];

export function TrustBadgesRow() {
  return (
    <section className="bg-secondary/30 border-y border-border py-5">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 text-foreground"
            >
              <Icon className="h-5 w-5 text-primary" strokeWidth={2.25} />
              <span className="text-sm md:text-base font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Wire-in (`src/pages/Index.tsx`)
```tsx
import { TrustBadgesRow } from "@/components/home/TrustBadgesRow";

// ...
<HeroSection />
<TrustBadgesRow />        {/* NEW */}
<CategoriesSection />
```

### Visual approach
- Lucide icons (Shield, Zap, Award) — consistent with the rest of the site (no emoji rendering inconsistency across OS/browsers)
- Muted `bg-secondary/30` band with thin top/bottom borders — visible but quiet, sits naturally in the whitespace
- Horizontal on desktop/tablet, wraps to 2-3 lines on mobile (390px) gracefully
- Primary-color icons, foreground text — matches site palette

---

## Out of Scope
- Hero section, hero images, hero CTAs, review badge in hero
- Booking modal / Jotform
- Testimonials section
- `SEOContentSection`, `CategoriesSection`, FAQs, footer
- All other pages (changes are homepage + shared `DeliveryAreasSection` only)

## Files Changed
- `src/components/home/DeliveryAreasSection.tsx` — add city-level service area pill + sub-label above existing neighborhood grid
- `src/components/home/TrustBadgesRow.tsx` — **new** component for the 3 trust badges
- `src/pages/Index.tsx` — import and render `<TrustBadgesRow />` between `<HeroSection />` and `<CategoriesSection />`

