# Free-or-Call delivery, weekend promo pricing, promo popup

## What I found first (where fees and pricing live)

Delivery fees are defined in **four** places, and they must all match:
1. Website ZIP list (`src/data/deliveryZones.ts`), used for the badge under the ZIP field and the checkout screen.
2. Server ZIP list (`supabase/functions/_shared/deliveryZones.ts`), which checks the price when the customer pays.
3. The delivery-zones table in the database. It overrides both lists while the site is running. Right now it has 31 free, 2 call, 3 at $50 and 4 at $75.
4. Admin Settings has a ZIP editor that still offers a "Paid" option with a fee amount.

Rental-length multipliers (the Full Weekend 1.6x) are defined in **three** places:
1. `src/lib/pricing.ts`, used by the cart, checkout screen and admin form.
2. `create-booking-checkout`, the server copy that sets the Stripe amount.
3. `finalizeBooking.ts`, the server copy that records the booking after payment.

Old bookings that were charged a delivery fee keep it. Admin screens and emails will still show a stored fee on those records.

## Section 1: Delivery is either free or call/text

- Replace both ZIP lists with exactly 33 free ZIPs and 7 call ZIPs: 32708, 32709, 32819, 32820, 32836, 34761, 34786. Remove the "paid" option and the $50 and $75 rows.
- Update the database table to match:
  - Set 32828 and 32832 to free.
  - Set 32708, 32819, 32836, 34761 and 34786 to call, with fee 0.
- Any ZIP not on either list is treated as call/text. This already happens on the website and the server; I will keep it.
- Admin Settings ZIP editor: only "Free" and "Call" choices, and no fee box.
- Server checkout always uses a $0 delivery fee and refuses any ZIP that needs a call.
- New-booking screens (ZIP badge, checkout screen, cart) no longer show a delivery-fee line.
- Address step in the reservation window: for a call ZIP, the Continue button area is replaced with the friendly message you wrote, plus a **Call** button and a **Text** button for (407) 497-1840.
  - Everything the customer typed stays filled in.
  - GA4 records a `delivery_zone_call_required` event with the ZIP.
- Homepage delivery section: rewrite the text so it says free delivery for most neighborhoods, and call or text to book for Bithlo and Christmas.

## Section 2: Book Saturday, get Sunday free

- New switch `WEEKEND_PROMO_ACTIVE = true` in `src/lib/pricing.ts`. It controls:
  - Full Weekend price: 1.0x while on, 1.6x when off.
  - The "FREE UPGRADE" badge versus the "+60%" badge.
  - The new description: "Saturday 8 AM delivery through Sunday 8 PM pickup. Sunday is free for a limited time."
  - Option order: Day Rental → Full Weekend → Overnight while on; the original order when off.
- The two server copies follow the same rule. Each has its own matching switch with a comment pointing to the website copy, because the server can't import website files.
- The cart drawer and the checkout's rental-length picker show the original price crossed out (for example ~~$238.40~~ $149.00).
- The Saturday-only calendar and the greyed-out unavailable dates stay as they are.

## Section 3: Weekend promo popup

- New `src/components/WeekendPromoPopup.tsx`, added once in `App.tsx` inside the router and outside the page routes. It only appears when `WEEKEND_PROMO_ACTIVE` is on.
- When it opens:
  - On desktop (768px wide or more), when the mouse leaves through the top of the window.
  - On phones, at 50% scroll depth.
  - Never on page load, and never on /cart, /checkout or /thank-you.
- Shows once per visitor every 7 days (saved as `oi_weekend_promo_seen`, with private-browsing safety).
- Closes with Escape, a click on the dark background, the X button, or "No thanks, maybe later". The page behind it can't scroll while it's open.
- GA4 records `promo_popup_view` and `promo_popup_click`, both with `promo_name: book_saturday_get_sunday_free`.
- Text exactly as you wrote it. The "Browse Rentals →" button goes to /rentals.
- Uses the site's own blue and orange colors (I'll add an orange color setting if the site doesn't have one). About 28rem wide, readable on a 375px phone, and set up correctly for screen readers.

## How I'll check it

- Enter 34761 and 32836 in the address step: the call/text message appears and there's no way to continue.
- Go through a Full Weekend booking to the payment step: the final summary shows the day-rate price and no delivery line.
- Ask the server checkout directly to confirm the Stripe amount matches.
- Popup on desktop and a 375px phone.

Afterwards I'll list every changed file and confirm each of these.
