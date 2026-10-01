# Verify four items + remove the moon emoji

## 1. Live delivery-zone table (already checked)
The preview and the live site share one database, so there's only one table to check. A read just now shows:
- 33 free ZIPs, all with a $0 fee (32828 and 32832 are among them)
- 7 call ZIPs, all with a $0 fee: 32708, 32709, 32819, 32820, 32836, 34761, 34786
- 0 rows with a fee other than $0, and 0 rows marked "paid"

The two call ZIPs you didn't list, 32709 and 32820, are the two that were newly added. This item is done; the final report will just restate it.

## 2. Test the server's refusal directly
- Call the checkout function directly, skipping the website, with a valid cart (Dinosaur Raptor, a future date, full contact details) and ZIP 34761. Record the exact response.
- Repeat with 33801, which isn't on either list.
- Both should be refused with an error, and no Stripe session should be created. Check the function logs and `pending_bookings` to confirm nothing was written.
- If either one gets through, stop and report before fixing anything.

## 3. Real Full Weekend booking up to the Stripe amount
- Send the same direct request: Dinosaur Raptor, Full Weekend, a free ZIP (32828), damage waiver on, cash on delivery (so there's no 4% fee).
- Read back the amounts the server calculated (the pending booking record and the Stripe session amount).
- Compare against the expected numbers: $238.40 subtotal, $23.84 waiver, $17.05 tax, $279.29 total, $0 delivery. Report the exact Stripe charge too ($5.45 deposit).
- If anything differs, stop and report. No changes.
- Delete the test Stripe session afterwards. It's an unpaid checkout, so it expires on its own anyway. Also remove the test pending row.

## 4. Popup stays hidden when the cart has an item
- In the browser: add an item to the cart, wait 20 seconds on the page, and confirm the popup never opens (screenshot plus a page check).
- Control run: empty cart, and confirm it does open at 15 seconds.

## 5. Remove the moon emoji
- Remove the moon emoji from the desktop and phone text in the promo bar, and check the popup for it too. The wording otherwise stays exactly the same.
- Screenshot the bar afterwards to confirm no blank box.

## Technical notes
- Direct calls go to `create-booking-checkout` using the anon key, with the same body shape `CheckoutModal` sends.
- Emoji edit is in `WeekendPromoBar.tsx` (and `WeekendPromoModal.tsx` if it's there too).
