
# Replace Hero CTA with Prominent Booking Button

## Summary
Replace the existing "Check Availability" button in the hero section with a larger, higher-contrast "Check Availability for Your Date" button. Keep the phone button. Hero will have exactly two CTAs.

## Changes

**File:** `src/components/home/HeroSection.tsx`

Replace the current "Check Availability" button (lines ~42-49) with a more prominent version. The phone button stays unchanged. No new buttons added.

### Before (two buttons)
1. Check Availability (secondary styling)
2. (407) 497-1840

### After (two buttons)
1. **Check Availability for Your Date** (large, high-contrast accent)
2. (407) 497-1840 (unchanged)

### New button styling
- `size="lg"` with extra padding (`px-10 py-7`) for visual prominence
- High-contrast accent background: `bg-accent hover:bg-accent/90 text-accent-foreground`
- Bold weight, `text-lg md:text-xl`, `shadow-2xl`, `btn-bounce` animation
- Full-width on mobile (`w-full sm:w-auto`)
- Trailing `ArrowRight` icon retained

### Wiring
Reuses the existing `showJotform` state and mounted `JotformModal` — no JotForm changes, no new modal instance.

```tsx
<Button
  onClick={() => setShowJotform(true)}
  size="lg"
  className="bg-accent hover:bg-accent/90 text-accent-foreground btn-bounce text-lg md:text-xl px-10 py-7 font-bold shadow-2xl w-full sm:w-auto"
>
  Check Availability for Your Date
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>
```

## Out of Scope
- No changes to `JotformModal.tsx`, the JotForm URL, or modal behavior
- No changes to header buttons, sticky button, CTASection, or other pages
- No new third button — strictly a replacement of the existing one

## Files Changed
- `src/components/home/HeroSection.tsx` — replace existing "Check Availability" button with the prominent "Check Availability for Your Date" button
