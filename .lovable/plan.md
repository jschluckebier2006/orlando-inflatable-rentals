## Goal
Remove the placeholder "Fake" booking (fake@example.com, event date 2099-01-15) so it stops showing on the admin calendar.

## What I'll do
Run a database migration that deletes the related rows for booking id `a34304d1-bf1e-4c2c-b47b-6793cc13c75b`:

1. Delete any `booking_items` linked to that booking.
2. Delete any `booking_payments` linked to that booking.
3. Delete any `booking_activity` linked to that booking.
4. Delete the booking row itself from `bookings`.

The other three bookings (Jamie test / Jamie test 2 / Jamie Schluck) will be left untouched per your selection.

## No code changes
The calendar reads live from the `bookings` table, so removing the row is enough — no frontend edits required.