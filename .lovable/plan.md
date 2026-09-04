# Permanent delete for paid bookings + Megan backfill

## Answer to your question first

The reconciler matches deletions **only** on the Stripe session ID and PaymentIntent ID stored in the audit entry's metadata. `created_at` is used for one thing only: sorting the most recent 500 deletion records it loads. There is currently 1 such record, so ordering is irrelevant and nothing depends on the timestamp. Using the real insertion time is safe.

## Part 1 — Megan's reconstructed entry (as agreed, with your change)

One audit entry for booking `738ed40c-9ee8-48e7-84a3-30e7889aa2db`:

- Customer Megan Pahl, mlpahl1989@gmail.com, event 2026-08-22, $5.45 deposit
- The Stripe session and PaymentIntent copied verbatim from the stored alert payload
- Actor: unknown — predates deletion logging
- Real insertion time (no backdating), plus `deletion_occurred_between: "2026-08-23 and 2026-09-02"`
- `backfilled: true`, a reason field, and the four lifecycle emails listed as evidence
- Summary line states plainly that it is a reconstructed record, not a captured one

Confirmed earlier: no booking row exists, no audit row exists, the exclusion logic is sound, and she is the only unmatched charge in the last two morning alerts.

## Part 2 — Permanent delete for paid bookings

### What you see

On a paid booking, the overflow menu gains **Permanently delete** — placed apart from Archive, in destructive red, below a separator. The plain Delete stays where it is and stays blocked for paid bookings.

The confirmation dialog:

- States exactly what is destroyed: the booking, its line items, its payment records, and its activity history
- Shows customer name, event date, amount paid, and the Stripe PaymentIntent
- Notes clearly that **the Stripe charge is untouched and remains in Stripe's records** — this deletes your record, not the payment
- Requires a typed `PERMANENTLY DELETE`
- Requires a written reason
- Button stays disabled until both are filled in

### What happens behind it

Before anything is removed, the full booking row, every line item, every payment row and every activity entry are captured into the audit entry. The actor, the exact time, your typed reason, and the Stripe session and PaymentIntent IDs are recorded alongside it — those last two are what the reconciler matches on, so the charge is excluded from that morning's alert and every one after.

### The guard stays strict

The database guard is not loosened. Purge runs through a single admin-only path that marks itself as authorised for that one booking, for that one statement. Every other delete attempt on a paid booking — from the plain Delete button, from a script, from anywhere — still fails exactly as it does today.

### Verification

After building I will run a real end-to-end test: create a throwaway booking with a payment row, confirm the plain delete is refused, purge it through the new action, confirm the audit entry contains the full snapshot, and confirm a plain delete on a paid booking is still refused afterwards. Then re-run the reconciliation report and confirm Megan's charge moves from "unmatched" to "deliberately deleted" with an unmatched count of zero. I'll report actual results, not intentions.

## Technical detail

- `INSERT` into `public.admin_audit_log` for the backfill (data change, no schema change).
- New `public.purge_paid_booking(p_booking_id uuid, p_reason text)` — `SECURITY DEFINER`, `search_path = public`. It: rejects non-admins via `has_role(auth.uid(), 'admin')`; requires a non-empty reason; assembles `before` as `{booking, items, payments, activity}` and `metadata` as `{purge: true, reason, stripe_session_id, stripe_payment_intent_id, amount_paid, customer_*, event_date}`; inserts the audit row with `action = 'hard_delete'`; sets `set_config('app.purge_authorized', p_booking_id::text, true)` (transaction-local); deletes children then the booking. `EXECUTE` granted to `authenticated` only.
- `guard_and_audit_booking_delete()` is amended to skip its money block **only** when `current_setting('app.purge_authorized', true) = old.id::text`, and to skip writing its own audit row in that case (the RPC already wrote a richer one). All other behaviour, including the block for unauthorised deletes on paid bookings, is unchanged.
- `Bookings.tsx`: new `purgeTarget` state, dialog with `purgeConfirmText` + `purgeReason`, calling the RPC and removing the row from local state on success. Existing `confirmDelete` and its `hasCapturedPayment` block stay as they are.
- The reconciler needs no change — `deletedBySession` / `deletedByPi` already key off the metadata fields above.
