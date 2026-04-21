
# Add Google Review Trust Badge to Hero

## Summary
Add a compact 5-star Google review trust badge to the hero section of the homepage, positioned directly below the main H1 headline so it's visible before the fold on both mobile and desktop.

## Changes

**File:** `src/components/home/HeroSection.tsx`

Insert a new trust badge element between the H1 heading and the existing subheading paragraph.

### Layout & Position
- Placed immediately after the `<h1>` (before the subheading `<p>`)
- Centered horizontally to match the existing hero text alignment
- Compact inline-flex pill: stars + rating number + clickable review count
- Visible above the fold at both 390px mobile width and desktop widths
- Margin tuned to sit tight under the headline (`mb-6` on the badge, reduce H1 `mb-6` to `mb-4` so spacing stays balanced)

### Visual Design
- Background: `bg-white/15 backdrop-blur-sm` pill with subtle border `border border-white/20` — matches the existing "Serving East Orlando" badge style above the H1 for consistency
- Rounded full pill: `rounded-full px-4 py-2`
- Stars: 5 filled `Star` icons from `lucide-react`, color `text-accent` (site's yellow/orange accent), size `h-4 w-4` or `h-5 w-5`
- Rating text: `5.0` in bold white
- Em-dash separator
- Link: "63 Google Reviews" — white text, underline on hover, opens in new tab
- Drop shadow to maintain readability over the hero image: `drop-shadow-lg`

### Link Behavior
```tsx
<a
  href="https://www.google.com/maps/place/Orlando+Inflatable+Rentals+LLC"
  target="_blank"
  rel="noopener noreferrer"
  className="underline hover:text-accent transition-colors"
>
  63 Google Reviews
</a>
```

### Markup Sketch
```tsx
<div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in drop-shadow-lg">
  <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
    ))}
  </div>
  <span className="font-bold text-white text-sm md:text-base">5.0</span>
  <span className="text-white/80 text-sm md:text-base">—</span>
  <a
    href="https://www.google.com/maps/place/Orlando+Inflatable+Rentals+LLC"
    target="_blank"
    rel="noopener noreferrer"
    className="text-white text-sm md:text-base font-medium underline underline-offset-2 hover:text-accent transition-colors"
  >
    63 Google Reviews
  </a>
</div>
```

### Imports
- Add `Star` to the existing `lucide-react` import line

## Out of Scope
- No changes to the existing top "Serving East Orlando & Orange County" badge
- No changes to CTA buttons, phone link, or trust indicators row at the bottom of the hero
- No changes to other pages (only the homepage hero)
- No new schema markup (existing `AggregateRatingSchema` / `LocalBusinessSchema` already handle review structured data)

## Files Changed
- `src/components/home/HeroSection.tsx` — add `Star` import and insert the trust badge between the H1 and the subheading
