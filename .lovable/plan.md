

# Force Trust Badges to Single Horizontal Row

## Change
**File:** `src/components/home/TrustBadgesRow.tsx`

Update the flex container className only.

**From:**
```tsx
<div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
```

**To:**
```tsx
<div className="flex flex-nowrap items-center justify-center gap-4 md:gap-10 overflow-x-auto">
```

## Effect
- `flex-nowrap` keeps all 3 badges on one line at every breakpoint (including 390px mobile)
- `overflow-x-auto` provides horizontal scroll fallback if total width ever exceeds viewport, preventing layout breakage

## Out of Scope
- Badge content, icons, labels, colors, padding, section background, borders — all unchanged
- No other files touched

## Files Changed
- `src/components/home/TrustBadgesRow.tsx` — single className update on the inner flex div

