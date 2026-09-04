# Stop the daily alert about Megan Pahl's $5.45 charge

## What I checked first

Both of your checks came back the way you suspected:

**1. Your diagnosis is correct — it's missing history, not broken logic.**
- There is no booking row for `738ed40c-9ee8-48e7-84a3-30e7889aa2db` and none for her email.
- The whole deletion history contains exactly one deletion record, and it's the test-harness row created 2026-09-03 — after her booking was already gone. So there is nothing for the reconciler to match against.
- The exclusion step itself reads the deletion history correctly: it pulls deletion records and matches them by Stripe session ID and payment ID. Its inputs are simply empty for her, so it has no way to know the deletion was intentional. Nothing in that logic needs changing.
- Her booking was clearly real and fulfilled: four emails went out against that booking ID — customer confirmation and admin notification on 2026-08-18, day-before reminder on 2026-08-21, post-event review on 2026-08-23.

**2. She's the only one.** The last two morning alerts (2026-09-03 and 2026-09-04) each list exactly one unmatched charge — hers. Zero stuck payment events, two fully refunded charges already excluded automatically. No other pre-trigger deletion is being flagged.

## The fix

Add one reconstructed deletion record for her booking, containing:

- Booking ID `738ed40c-9ee8-48e7-84a3-30e7889aa2db`, Megan Pahl, mlpahl1989@gmail.com
- Event date 2026-08-22, amount $5.45 deposit, delivery address from the Stripe receipt (Orlando, FL 32808)
- The Stripe session and payment IDs exactly as Stripe reports them, so the matcher lines up
- Actor recorded as "unknown — predates deletion logging"
- A plainly worded note that this entry was reconstructed after the fact from the four emails listed above, that the rental was fulfilled before the booking was hard-deleted, and flags marking it as backfilled rather than a captured deletion

The summary line and a `backfilled: true` marker make it impossible to mistake for a genuine captured record, both in the Activity log and in any future audit.

## Verification

After inserting, I'll re-run the reconciliation report for the same window and confirm the charge moves out of the "unmatched" list into the "deliberately deleted" list, with the unmatched count at zero. If it doesn't move, I'll say so rather than declare it fixed.

## Technical detail

- Single `INSERT` into `public.admin_audit_log` with `entity_type = 'booking'`, `action = 'hard_delete'`, `created_at` set to 2026-08-23 (after the last lifecycle email) and `metadata` carrying `stripe_session_id`, `stripe_payment_intent_id`, `backfilled: true`, `backfill_reason`, and `evidence` listing the four `email_send_log` rows. `before` stays `{}` — no snapshot exists and inventing one would be worse than an empty object.
- No code changes. `stripe-reconcile` already keys its `deletedBySession` / `deletedByPi` maps off exactly these metadata fields.
- Session and payment IDs will be copied verbatim from the stored alert payload to avoid character-lookalike transcription errors.
