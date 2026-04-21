

# Tighten Trust Badges for Mobile Fit

## Changes
**File:** `src/components/home/TrustBadgesRow.tsx`

Two className edits only.

### 1. Flex container — reduce mobile gap
**From:**
```tsx
<div className="flex flex-nowrap items-center justify-center gap-4 md:gap-10 overflow-x-auto">
```
**To:**
```tsx
<div className="flex flex-nowrap items-center justify-center gap-3 md:gap-10 overflow-x-auto">
```

### 2. Badge label `<span>` — smaller mobile text + prevent intra-label wrap
**From:**
```tsx
<span className="text-sm md:text-base font-semibold">
```
**To:**
```tsx
<span className="text-xs md:text-sm font-semibold whitespace-nowrap">
```

## Effect
- Mobile (390px): tighter `gap-3` + `text-xs` + `whitespace-nowrap` keeps all 3 badges on a single visible row without horizontal scroll
- Desktop (≥768px): `gap-10` + `text-sm` preserved — visually unchanged
- `overflow-x-auto` retained as safety fallback

## Out of Scope
- Icons, icon size, section background, borders, padding, container, badge data — all unchanged
- No other files

## Files Changed
- `src/components/home/TrustBadgesRow.tsx` — two className updates

