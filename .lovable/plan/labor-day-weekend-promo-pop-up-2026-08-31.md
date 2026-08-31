# Labor Day Weekend Promo Pop-up

A single self-contained promo modal, mounted at the app root so it appears on every page. No existing page content or layout is touched.

## Behavior

- Fires 3 seconds after load, site-wide.
- Shows once per browser session via a `sessionStorage` flag (`laborDay2026PopupSeen`), set on dismiss or CTA click. New session = shows again.
- Date gate: renders nothing at all after **September 6, 2026, 11:59 PM Eastern**, stored in one named constant at the top of the file for easy editing.

## Layout

Centered modal, max-width 420px, rounded corners, drop shadow, dark semi-transparent blurred backdrop.

- **Top:** the uploaded Labor Day promo graphic, full modal width, flush to the top edge inside the rounded corners, `object-cover`, no distortion. Alt text: "Free overnight rental this weekend only — rent any inflatable and keep it overnight at no extra charge." Under 500px viewport height the image height is capped and crops from the bottom so buttons stay visible.
- **Bottom** (site background color):
  - Primary: `📞 Call to Book — 407-497-1840` → `tel:+14074971840`, brand primary color, visually dominant.
  - Secondary: `Text Us` → `sms:+14074971840`, lighter outline style.
  - Small text: "Phone bookings only · Subject to availability"
  - Fine print: "Valid 09/04/26–09/06/26. Exclusions apply. Call for offer details and limitations."

Buttons min 52px tall, full-width stacked on mobile, side-by-side on desktop. Existing fonts and brand tokens only — no new visual language.

## Accessibility

- Floating "×" close button top-right over the image, subtle dark circular backdrop for contrast, 44×44px minimum tap target.
- Closes on ESC, backdrop click, and ×.
- Focus trapped while open; focus returns to the previously focused element on close.
- `role="dialog"`, `aria-modal="true"`, aria-label describing the offer.
- Body scroll locked while open, restored on close.
- Fade-in + slight scale-up (~200ms), disabled under `prefers-reduced-motion`.
- Verified at 375×667: no horizontal overflow, both buttons visible without scrolling, fine print legible.

## Technical notes

- Uploaded image published through Lovable Assets; the component imports the generated `.asset.json` pointer.
- New file `src/components/promo/LaborDayPromoModal.tsx`, rendered once inside `src/App.tsx` next to the existing `CartDrawer` / `CheckoutModal` mounts.
- Built on the project's existing shadcn `Dialog` primitives (Radix already handles focus trap, ESC, backdrop click, scroll lock), with custom padding-free content so the image sits flush to the rounded top edge.
- Date gate compares against a fixed UTC instant equivalent to 2026-09-07T03:59:59Z so it behaves correctly regardless of visitor timezone.
