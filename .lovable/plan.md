## Re-enable Add to Cart and Remove Temporary Call-Us Button

### Goal
Restore the Add to Cart functionality on product cards to its state before the temporary disable, and remove the "Call Us to Book Now" placeholder button.

### What Changed Previously
In `src/components/inventory/ProductCard.tsx`, the original interactive Add to Cart button was replaced with:
1. An active "Call Us to Book Now" button linking to `tel:4074971840`
2. A disabled "Add to Cart — Temporarily Disabled" button

The `useCart` hook, `addItem`, `has`, and `openCart` logic were removed.

### What to Revert
Restore `ProductCard.tsx` to the pre-disable version:
- Re-import `Check`, `Plus` from `lucide-react`
- Re-import `useCart` from `@/contexts/CartContext`
- Restore `handleAdd` logic: adds item to cart if not present, opens cart drawer
- Make the entire card clickable (`cursor-pointer`) with `handleAdd`
- Replace the two temporary buttons with a single button showing:
  - `In Cart — View` (with Check icon) when already in cart
  - `Add to Cart` (with Plus icon) otherwise
- Button style: `bg-secondary hover:bg-secondary/90 text-secondary-foreground`

### Scope
Only `src/components/inventory/ProductCard.tsx` is affected. No database, API, or other component changes needed.