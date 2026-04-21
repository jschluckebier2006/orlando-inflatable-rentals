

# Remove Inline Trust Indicators from Hero Section

## Change
**File:** `src/components/home/HeroSection.tsx`

Remove the entire "Trust Indicators" block that sits below the CTA buttons — the flex row containing the 3 checkmark items: "Licensed & Insured", "Free Delivery", and "Same-Day Setup".

### Block to remove
```tsx
{/* Trust Indicators */}
<div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/90 animate-fade-in drop-shadow-lg" style={{ animationDelay: "0.6s" }}>
  <div className="flex items-center gap-2">
    <svg ...>...</svg>
    <span className="font-medium">Licensed & Insured</span>
  </div>
  <div className="flex items-center gap-2">
    <svg ...>...</svg>
    <span className="font-medium">Free Delivery</span>
  </div>
  <div className="flex items-center gap-2">
    <svg ...>...</svg>
    <span className="font-medium">Same-Day Setup</span>
  </div>
</div>
```

This is the only edit. Everything above it (badge, H1, star/Google review badge, subheading, CTA buttons, phone button) and everything around it (hero background image, dark overlay, wave divider, JotformModal) remains exactly as-is.

## Rationale
The dedicated `TrustBadgesRow` component now sits directly below the hero and serves this purpose, making the in-hero indicators redundant.

## Out of Scope
- Hero CTAs, phone button, star badge, H1, subheading, hero background, wave divider, JotformModal
- `TrustBadgesRow` component (kept as-is)
- Any other file

## Files Changed
- `src/components/home/HeroSection.tsx` — delete the Trust Indicators flex block only

