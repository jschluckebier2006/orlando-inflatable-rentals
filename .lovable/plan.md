## Fix: Stripe webhook not delivering → bookings stuck on "pending"

### Root cause (confirmed via logs)
The `payments-webhook` edge function IS being hit by Stripe now, but it's failing signature verification because of a code bug:

```
Signature verification failed Error: STRIPE_SANDBOX_API_KEY is not configured
```

The handler reads `?env=` from the URL. The Stripe endpoint you configured is calling the function **without** `?env=live`, so it defaults to `sandbox` and tries to load `STRIPE_SANDBOX_API_KEY`, which doesn't exist in this project's secrets. Verification throws → Stripe gets 400 → no booking row is ever inserted → return page polls 10× and falls through to "Payment received / pending".

### What you need to do in Stripe (manual, one-time)

1. Open Stripe Dashboard → make sure you're in **Live mode** (top-right toggle).
2. Go to **Developers → Webhooks**.
3. Find the existing endpoint pointing at this project (or **Add endpoint** if none exists).
4. Set the **Endpoint URL** to exactly:
   ```
   https://wwyyfgngdwaabzwzvlml.supabase.co/functions/v1/payments-webhook?env=live
   ```
   The `?env=live` query string is required.
5. Under **Events to send**, subscribe to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
6. Save. Then click the endpoint → **Signing secret** → **Reveal** and confirm it matches the `PAYMENTS_LIVE_WEBHOOK_SECRET` already stored in this project. If it doesn't, copy the new value and I'll update the secret.

### Verification

After you save the endpoint, run a real test booking. Expected flow:
- Stripe POSTs `checkout.session.completed` to `…/payments-webhook?env=live`
- Handler verifies signature with `PAYMENTS_LIVE_WEBHOOK_SECRET` → inserts `bookings` row + `booking_items`
- The return page's `check-booking-status` poll returns `confirmed: true` within 1–2 seconds
- Confirmation email sends

I'll then check `payments-webhook` logs to confirm a clean 200 and a new `bookings` row exists.

### No code changes required
The webhook code itself is correct once it's reached with the right `?env=live` and matching signing secret. I'll only make code changes if, after you fix the endpoint URL, logs show a new failure mode.
