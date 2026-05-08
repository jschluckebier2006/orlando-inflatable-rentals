## Goal

Tear down the current Stripe integration (claimed under your account) so Austin can re-enable it from scratch under his own Stripe account, while preserving all existing checkout/booking code so it works again automatically once the new connection is live.

## Why a clean re-do works

The Stripe checkout flow is already fully built (`PaymentStep.tsx`, `create-booking-checkout` edge function, `payments-webhook`, `pending_bookings` table, return page). All of that code reads its credentials from environment variables that Lovable swaps out automatically when Stripe is re-enabled. Disconnecting and reconnecting only changes the **credentials**, not the **code** — so nothing has to be rewritten.

## Steps

### 1. You disconnect the current Stripe integration
- Go to **Connectors** (left sidebar) → **Lovable Cloud** → **Stripe** → **Disconnect**
- This clears `STRIPE_SANDBOX_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`, and `VITE_PAYMENTS_CLIENT_TOKEN` from the project
- The orphaned sandbox under your Stripe account can be ignored or deleted later from your Stripe dashboard — it won't affect anything

### 2. Give Austin access to this Lovable project
- Go to **Project Settings → People** (or Workspace → People)
- Invite `austin@bouncewavesales.com` as an **Admin** so he can use the Payments tab and the Connectors panel

### 3. Austin enables Stripe under his own account
Austin signs in to Lovable, opens this project, and:
- Makes sure he is logged into **his** Stripe account in another browser tab first (this is the critical step — whoever is logged into Stripe when the claim link is clicked becomes the owner)
- Opens the **Payments** tab in Lovable and clicks **Enable Stripe**
- Clicks the claim link → Stripe pages → either creates a new account or links to his existing Bounce Wave Sales Stripe account
- Verifies his email when Stripe sends the confirmation

### 4. Austin completes the 5 go-live steps
Inside the Lovable Payments tab, the same 5-step wizard appears. Since Austin is now the original setup member, he can complete every step:
1. Claim sandbox (done in step 3)
2. Complete Stripe go-live form (business verification, bank, 2FA)
3. Install Lovable app on the LIVE Stripe account
4. Lovable provisions live API keys (automatic)
5. Readiness check

### 5. Verify everything reconnected (no code changes needed)
After Austin finishes, confirm the env vars are repopulated:
- `STRIPE_SANDBOX_API_KEY` and `PAYMENTS_SANDBOX_WEBHOOK_SECRET` (test mode)
- `STRIPE_LIVE_API_KEY` and `PAYMENTS_LIVE_WEBHOOK_SECRET` (after go-live completes)
- `VITE_PAYMENTS_CLIENT_TOKEN` in `.env.development` and `.env.production`

Then place a $1 test booking in preview to confirm the embedded checkout still loads.

## What we're NOT doing
- Not deleting any code (PaymentStep, create-booking-checkout, payments-webhook, CheckoutModal all stay)
- Not removing any database tables (`bookings`, `pending_bookings`, `booking_items` stay)
- Not removing the `PaymentTestModeBanner` (auto-hides in production already)
- Not touching the cart, products, or any UI

## Heads up
- Once disconnected, the embedded payment step in CheckoutModal will throw an error if anyone tries to check out until Austin finishes step 3 (sandbox claimed). If you want, we can temporarily hide the payment step and re-show the "Call to book" fallback during the gap — let me know.
- The current booking data (if any test bookings exist in the DB) is preserved.
