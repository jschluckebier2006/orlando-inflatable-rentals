# Lock the money on paid bookings

Editing a paid booking must never move the totals. Today the admin edit form recalculates every money field from scratch on each Save and writes the result over the stored values — which is how a booking that was charged $311.59 now reads $303.42.

## What changes

### 1. Paid bookings open in locked mode

A booking is "locked" when it has any payment recorded (paid amount above zero). In that mode the edit form shows the stored money exactly as saved and writes none of it back:

- Line items, item prices, add/remove product, rental duration, discount, damage waiver and the payment-type selector are all read-only.
- The totals panel renders the stored subtotal, delivery fee, damage waiver, tax, convenience fee, total, paid amount and balance — no recalculation.
- A short note explains why: "Totals locked — this booking has a payment recorded."
- Save writes only the non-money fields: name, email, phone, address, city, ZIP, event date, times, event type, notes and status.

Contact and logistics edits become completely safe. There is no path where hitting Save moves a dollar.

### 2. Re-pricing becomes a deliberate action

A "Re-price booking" button in the totals panel unlocks the pricing controls. Changing them and saving opens a confirmation that spells out the consequence before anything is written:

```text
Re-price this booking?

Old total      $311.59
New total      $303.42
Paid           $311.59
Result         $8.17 credit owed to customer
```

The result line reads "balance due" when the new total is higher and "credit owed to customer" when it is lower. Only after confirming does the form write the money fields, and it records an activity-log entry naming the old total, the new total, the resulting balance or credit, and who did it. Cancelling writes nothing.

### 3. Unpaid bookings are unchanged

No payment recorded means pricing stays fully editable and recalculates on Save exactly as it does now.

### 4. A related bug worth fixing in the same pass

The edit form recalculates totals with the delivery fee hardcoded to zero, and never writes the delivery fee back. So re-pricing any booking that had a delivery charge silently drops that charge from the total while leaving the stored fee untouched — the two disagree from then on. The re-price path will read the booking's stored delivery fee into the calculation and save it back with the rest.

## Audit of every other path that writes booking money

Checked all code that can update a booking row:

| Path | Writes money? | Verdict |
|---|---|---|
| Reschedule dialog | No — event date and end date only | Safe, no change |
| Status change, cancel, archive, unarchive | No — status and archive flags only | Safe, no change |
| Record payment dialog | Payment rows only; the database recalculates paid amount and balance | Correct by design |
| Charge balance (server) | Sets paid amount and clears balance after a real charge | Correct by design |
| Customer detail page | Customer contact fields only | Safe, no change |
| Checkout and finalize (server) | Sets totals once when the booking is created | Correct by design |

There is no bulk edit feature. The admin edit form is the only place with the silent re-pricing defect, so it is the only one that needs the fix.

## Note on the $8.17

The decomposition I gave earlier — a $7.67 delivery fee dropping out — is arithmetically exact but unproven: the stored delivery fee on that booking reads $0.00 and no audit row survives from before the change, so I cannot say with certainty which component moved. What is certain is that the booking was edited three months after the card was charged, and that the edit form recomputes the total and omits delivery entirely. Her record stays as-is per your call.

## Technical detail

- `src/components/admin/BookingFormModal.tsx` — add a `moneyLocked` flag derived from stored paid amount and a `repriceMode` state; gate the pricing controls and the totals panel on it; build the Save payload in two shapes so the locked shape omits every money column and skips the booking-items delete-and-reinsert; add the re-price confirmation dialog and the activity-log write.
- No database migration and no edge function changes.
