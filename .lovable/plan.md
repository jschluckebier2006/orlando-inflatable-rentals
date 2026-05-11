## Goal
Draw attention to the "I have read and agree…" cancellation policy checkbox on the Payment step so customers notice it before clicking Confirm Reservation.

## Change
**File:** `src/components/booking/PaymentStep.tsx`

- While `agreed === false`, apply a pulsing animation to the checkbox (and a soft ring) so it visibly draws the eye.
- Once the user checks the box, the pulse stops immediately (no distraction after agreement).
- Use Tailwind's built-in `animate-pulse` plus a `ring-2 ring-primary/60` halo on the Checkbox; keep all colors on semantic tokens (no hard-coded colors).
- No changes to logic, validation, copy, or layout — purely a presentational nudge.

## Out of scope
- No changes to the cancellation policy text, the Confirm button gating, payment options, or any backend logic.
