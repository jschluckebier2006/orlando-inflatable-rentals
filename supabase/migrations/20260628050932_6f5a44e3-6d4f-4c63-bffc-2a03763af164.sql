
WITH candidates AS (
  SELECT b.id,
         b.stripe_payment_intent_id,
         b.total_amount,
         b.amount_paid,
         COALESCE((SELECT SUM(amount) FROM public.booking_payments bp WHERE bp.booking_id = b.id), 0) AS pay_sum,
         (SELECT COUNT(*) FROM public.booking_payments bp WHERE bp.booking_id = b.id) AS pay_rows
  FROM public.bookings b
  WHERE b.stripe_payment_intent_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.booking_payments bp
      WHERE bp.booking_id = b.id AND bp.reference = b.stripe_payment_intent_id
    )
)
INSERT INTO public.booking_payments (booking_id, method, amount, reference, notes, recorded_by)
SELECT id,
       'stripe',
       CASE WHEN pay_rows = 0
            THEN GREATEST(amount_paid, 0)
            ELSE GREATEST(total_amount - pay_sum, 0)
       END AS amount,
       stripe_payment_intent_id,
       'Backfilled Stripe Checkout deposit (migration).',
       'system'
FROM candidates
WHERE CASE WHEN pay_rows = 0
           THEN GREATEST(amount_paid, 0)
           ELSE GREATEST(total_amount - pay_sum, 0)
      END > 0;
