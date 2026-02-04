
# Update Mobile Product Cards UI

## Summary
Enhance the mobile product card experience with a larger price badge, updated pricing format, and a prominent "Book Your Date" CTA button.

## Changes Overview

| Change | Current | Updated |
|--------|---------|---------|
| Price badge size (mobile) | `text-sm px-3 py-1` | ~25% larger with responsive sizing |
| Price format | `$559` | `$559 / day` |
| Badge shadow | None | Subtle drop shadow |
| Mobile CTA button | None | "Book Your Date" button below content |

## Technical Implementation

### File: `src/components/inventory/ProductCard.tsx`

**1. Price Badge Updates:**
- Add responsive sizing: smaller on desktop, ~25% larger on mobile
- Update text format to include "/ day"
- Add subtle drop shadow for visibility on bright photos
- Keep top-right corner positioning

**2. Add Mobile CTA Button:**
- Add "Book Your Date" button inside CardContent
- Use `bg-secondary` (orange) with dark text for contrast
- Make it thumb-friendly: `min-h-[44px]` with generous padding
- Full-width within the card on mobile, hidden on desktop
- Wire to the same `onClick` handler that triggers the booking modal

### Code Changes

```tsx
// Updated ProductCard component structure:

<Card ...>
  <div className="aspect-square overflow-hidden relative bg-muted/30">
    <img ... />
    {/* Updated Badge with responsive sizing and shadow */}
    <Badge className="absolute top-3 right-3 md:top-3 md:right-3 
      bg-secondary text-secondary-foreground font-bold 
      text-base md:text-sm px-3 py-1.5 md:px-3 md:py-1
      shadow-md">
      ${product.price} / day
    </Badge>
  </div>
  <CardContent className="p-4">
    <h3>...</h3>
    {product.size && <p>...</p>}
    {product.ageRange && <p>...</p>}
    
    {/* New mobile CTA button */}
    <Button 
      onClick={onClick}
      className="w-full mt-3 min-h-[44px] bg-secondary hover:bg-secondary/90 
        text-secondary-foreground font-semibold md:hidden"
    >
      Book Your Date
    </Button>
  </CardContent>
</Card>
```

### Dependencies
- Import `Button` from `@/components/ui/button`
- The `onClick` prop already exists and triggers the JotformModal

## Visual Result

**Before (Mobile):**
- Small price badge: `$509`
- No CTA button, entire card is clickable

**After (Mobile):**
- Larger price badge with shadow: `$509 / day`
- Prominent orange "Book Your Date" button below product details
- Card still clickable for desktop users

## Layout Rules Addressed
- Price badge stays on the image (top-right corner)
- CTA button sits below title/dimensions with proper spacing (`mt-3`)
- Button is hidden on desktop (`md:hidden`) to preserve current layout
- Full-width button ensures consistent appearance across varying product name lengths
