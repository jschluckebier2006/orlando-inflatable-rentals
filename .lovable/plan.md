# Security finding: "Some access rules let everyone through" (6 tables)

## Short answer

- **No customer personal data has been publicly readable.** The two tables that hold names, phones, emails and event addresses (bookings, booking_items) only let signed-in admins read them. The finding on those two is about *adding* rows, not reading them.
- The other four tables hold the public product catalog and availability info. They are meant to be readable by visitors, and the website needs that to work.
- **Correction to one assumption:** customer bookings on the website are **not** saved by the visitor's browser. When a customer pays the deposit, our server saves the booking after Stripe confirms the payment, using the server's own access. A full code search found no place in the public site that writes to bookings or booking_items directly. The only browser code that writes to them is the admin "New booking" form, and that runs while you are signed in as an admin.

## Table by table

| # | Table | What it stores | Current rule | Public read? | Proposed change | Could it break customer booking? |
|---|---|---|---|---|---|---|
| 1 | bookings | Customer name, email, phone, event address, dates, totals, Stripe IDs | Anyone (signed out or in) may **add** a row with no checks. Reading, editing and deleting: admins only | **No** | Remove the "anyone can add" rule. Add "admins can add" so your admin New booking form keeps working | No. The website checkout saves through the server, which ignores these rules. Verified by test booking |
| 2 | booking_items | Which rentals are on each booking, with names and prices | Same as bookings: anyone may add, only admins read | **No** | Same as bookings: remove "anyone can add", add "admins can add" | No, same reason. Verified by test booking |
| 3 | delivery_zones | ZIP code, city, free/call status (no personal data) | Anyone may read; admins edit | Yes, on purpose | Keep as is, mark the finding as intended | Removing it **would** break the reservation window's ZIP check |
| 4 | inventory_blackouts | Dates a rental is unavailable, plus an internal reason note | Anyone may read; admins edit | Yes | Keep as is, mark as intended. Optional: hide the internal reason note from the public | Removing it could hide blocked dates from customers |
| 5 | inventory_images | Product photo links | Anyone may read; admins edit | Yes, on purpose | Keep as is, mark as intended | Removing it would blank every product photo |
| 6 | inventory_items | Product names, prices, descriptions, specs | Anyone may read; admins edit | Yes, on purpose | Keep as is, mark as intended | Removing it would empty the product pages and cart |

## Has personal data been exposed?

Not through reading. The real risk on tables 1 and 2 was that someone with the public site key could **insert fake bookings** (spam rows that block dates on the calendar). Nobody could read existing customers' details.

## Order of work, one table at a time

1. **bookings:** apply the change. Then run a test booking from the site (Full Weekend, ZIP 32828, waiver on, cash on delivery). Confirm the server saves it, the total is $279.29, the Stripe charge is $5.45, and a signed-out attempt to add a booking directly now fails. Confirm the admin New booking form still saves. Delete the test record.
2. **booking_items:** same change, same test booking, same checks.
3. **Tables 3 to 6:** no rule change. Mark each as intended public data. Run one more test booking to confirm the site still works.
4. Mark findings 1 and 2 as fixed, rescan, and report the results.

If any test fails, I stop, undo that one change, and report back before going further.

## Technical details

- Drop the policies `"anyone can create booking"` and `"anyone can create booking items"` (INSERT for anon and authenticated, WITH CHECK true).
- Add INSERT policies for authenticated users with `has_role(auth.uid(),'admin')` on both tables.
- Server-side writes (finalizeBooking → `create_booking_with_items` RPC, which only the service role can run) bypass these rules, so checkout is unaffected.
- Optionally revoke the anon INSERT grant on both tables.
