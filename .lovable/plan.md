## Goal

Activate the cart on inventory items: every product card shows a single, working **Add to Cart** button. Remove the "Call Us to Book Now" button now that the live booking system is ready.

## Change

`src/components/inventory/ProductCard.tsx`:

- Remove the `Call Us to Book Now` `<a href="tel:…">` button.
- Remove the `Phone` import (no longer used).
- Remove the `e.preventDefault()` placeholder in `handleAdd` and wire it to actually call `addItem(product)` and `openCart()` so the cart drawer slides open after adding.
- Drop the `disabled` / `aria-disabled` props from the Add to Cart button.
- When the item is already in the cart, swap the label/icon to `Added — View Cart` (Check icon) and clicking opens the cart drawer instead of re-adding.
- Keep the existing styling, sizing, and `min-h-[44px]` tap target.

## Out of scope

- No changes to the product detail modal/page logic, pricing, or category pages.
- No changes to the phone number's other appearances (sticky phone button, header, footer, hero) — only the per-item "Call Us to Book Now" button is removed.
- No changes to the `featureFlags.ts` file (booking is already enabled).
