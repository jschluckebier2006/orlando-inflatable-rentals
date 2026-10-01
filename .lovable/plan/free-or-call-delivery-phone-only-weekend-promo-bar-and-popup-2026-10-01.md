# Free-or-Call delivery + phone-only weekend promo (bar and popup)

## What I found first (where fees and pricing live)

Delivery fees are defined in **four** places, and they must all match:
1. Website ZIP list (`src/data/deliveryZones.ts`)
2. Server ZIP list (`supabase/functions/_shared/deliveryZones.ts`)
3. The delivery-zones table in the database. It overrides both lists while the site is running. Right now: 31 free, 2 call, 3 at $50, 4 at $75.
4. Admin Settings ZIP editor, which still has a "Paid" option.

Rental-length pricing (Full Weekend 1.6x) lives in three places: the website, the server checkout, and the booking record. **None of these change.**

Old bookings keep any delivery fee they were already charged.

## Section 1: Delivery is either free or call/text (approved)

- Both ZIP lists become exactly 33 free ZIPs and 7 call ZIPs: 32708, 32709, 32819, 32820, 32836, 34761, 34786. The paid option and the $50 and $75 rows are removed.
- Database table updated to match:
  - 32828 and 32832 become free.
  - 32708, 32819, 32836, 34761 and 34786 become call, with fee $0.
- Any ZIP not on either list is treated as call/text.
- Admin ZIP editor offers only Free and Call.
- The server always charges $0 delivery and refuses call ZIPs.
- New-booking screens no longer show a delivery-fee line.
- In the address step, a call ZIP replaces the Continue button area with your message and **Call** / **Text** buttons for (407) 497-1840.
  - Everything the customer typed stays filled in.
  - GA4 records `delivery_zone_call_required` with the ZIP.
- Service-area wording across the site is **on hold until you decide on each city** (decisions list already sent).

## Section 2: Cancelled

No promo pricing, database switch, admin toggle, badge, crossed-out prices, reordering, or description change. Full Weekend stays 1.6x everywhere.

## Section 3: Weekend promo bar and popup (display only, phone/text only)

One switch: `WEEKEND_PROMO_UI_ACTIVE` in a new shared file `src/config/weekendPromo.ts`. Setting it to false removes both the bar and the popup.

### 3A. Sticky promo bar
- Appears 2 seconds after the page loads and slides down.
- Sits at the very top, full width, brand blue with white text.
- Desktop text: "🌙 Limited time — Book Saturday, Get Sunday FREE".
- Narrow phones: "Book Saturday, Get Sunday FREE", wrapping to two lines if needed.
- Real tappable **Call** and **Text** buttons for (407) 497-1840, plus an × to dismiss.
- The bar is part of the normal page flow, above the utility strip. It pushes the page down instead of covering it.
- The header keeps sticking to the top as you scroll, with spacing for phone notches.
- The bar sits at the top, so it can't overlap the "Start Here" button at the bottom.
- Dismissal is remembered for 30 days (`oi_promo_bar_dismissed`), with private-browsing safety.
- GA4 events: `promo_bar_view`, `promo_bar_call`, `promo_bar_text`, `promo_bar_dismiss`.

### 3B. Timed popup
- Opens 15 seconds after the page loads. On desktop it opens earlier if the mouse leaves through the top of the window.
- Never shown if any of these is true:
  - the bar was dismissed
  - it was already seen in the last 7 days (`oi_promo_modal_seen`)
  - the reservation window is open
  - the cart has items
  - the page is /cart, /checkout or /thank-you
- These conditions are checked again at the moment the popup would open. Dismissing the bar also cancels the pending popup.
- Content exactly as written, with:
  - (407) 497-1840 shown large and tappable
  - the "Phone and text bookings only" line placed above the **Call Now** / **Send a Text** buttons
  - fine print, then "No thanks, maybe later"
- Never uses the phrase "this weekend only".
- Closes with Escape, a click on the dark background, the X, or the text link. The page behind can't scroll while it's open.
- Set up correctly for screen readers. About 28rem wide and readable at 375px.
- Brand blue and orange; I'll add an orange color setting if the site doesn't have one.
- GA4 events: `promo_modal_view`, `promo_modal_call`, `promo_modal_text`, `promo_modal_dismiss`.

### Existing Labor Day popup
It's already outside its end date, so it no longer shows. I'll leave it as is.

## How I'll check it
1. The bar doesn't cover the header, utility strip or Start Here button at desktop, tablet and 375px widths, with screenshots.
2. Dismissing the bar means no popup at 15 seconds.
3. No popup while the reservation window is open.
4. No popup with items in the cart.
5. Call and Text links are correct in both the bar and the popup.
6. Full Weekend is still 1.6x in the cart, at checkout and in the Stripe amount.
7. ZIPs 34761 and 32836 block checkout with the call/text message.

Then I'll list every changed file.
