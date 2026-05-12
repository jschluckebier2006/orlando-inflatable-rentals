## Revised build plan — $5.45 deposit, conditional 4% Online Payment Convenience Fee, true card-saving, COD path

Plan mode only — no code shipped until you approve.

---

## Answers to the prior 5 questions (unchanged, brought forward for reference)

**(a) `setup_future_usage` git history.** `git log --all -S setup_future_usage` → zero hits. Never been in this repo. We're building from scratch.

**(b) Where the deposit constant lives.** `$5.15` does not exist in code (chat-only). The actual deposit value lives in:
- `src/components/booking/PaymentStep.tsx` (local `DEPOSIT = 5` plus copy strings "$5 non-refundable deposit")
- `supabase/functions/_shared/settings.ts` (`DEFAULTS.defaultDeposit = 50` — divergent from PaymentStep's 5; this fix aligns them)
- `src/lib/appSettings.ts` (`DEFAULTS.defaultDeposit = 50` — same divergence)
- `app_settings.default_deposit` row (numeric, currently `50`)
- `supabase/functions/create-booking-checkout/index.ts` and `_shared/finalizeBooking.ts` consume via `settings.defaultDeposit`
- `src/components/admin/BookingFormModal.tsx` reads `getDefaultDeposit()` for admin form prefill
- Cancellation copy mentions "$50 cancellation fee" — different concept, leave alone.

After this build there will be two distinct numbers, defined once in shared pricing:
- `DEPOSIT_NET = 5.00` — net credit applied to the order total (`balance_due = total − DEPOSIT_NET`)
- `DEPOSIT_CHARGE = 5.45` — what Stripe actually charges today (covers Stripe's 2.9% + $0.30)

**(c) Admin references to `submit-booking`.** None. Full reference list:
- `supabase/functions/submit-booking/index.ts` (function source — delete)
- `supabase/config.toml` line 3 — `[functions.submit-booking]` block (delete)
- `src/components/booking/CheckoutModal.tsx` line 167 — call inside dead `handleSubmit` (delete the function + `submitting` state)
- `supabase/functions/security-tests/edge_flow_test.ts` — five Deno tests (per your decision, **delete** rather than rewrite; the double-booking trigger is exercised through the finalize path)
- No admin UI, no other edge function imports it.

**(d) Balance capture path.** Per your decision: build the in-app **"Charge balance now"** button (Step 11 + Step 12). Stripe-dashboard fallback always remains available; the button is a one-click convenience that also auto-records the `booking_payments` row, flips `payment_status` via the existing trigger, and ships the receipt email.

**(e) Email templates.** DB-driven via `email_templates` keyed by `booking_confirmation_customer` and `booking_new_admin`, rendered through `_shared/email.ts` `renderTemplate()`. The fee row is injected inside the `totalsBlock()` helper — no DB seed change needed for those two templates. We do add **one new template row**, `balance_paid_customer`, seeded by the migration in Step 1.

---

## Revisions baked into this plan (vs. the prior version)

1. **Fee rate is now 4%, not 3%**, and **conditional on payment method**:
   - `card_on_file` → 4% × (subtotal + waiver + delivery), taxable
   - `cash_on_delivery` → fee = $0
2. **Customer-facing label everywhere is "Online Payment Convenience Fee"** (with "(4%)" where space allows). DB column `checkout_fee_amount` keeps its current name.
3. **`app_settings.default_deposit` updated 50 → 5** in the migration.
4. **`submit-booking` security tests deleted** outright.
5. **In-app `admin-charge-balance` edge function + admin button** stay in scope.
6. **Option 2 wording**: "Reserve with $5.45, remaining balance charged the week of your event." Authorization paragraph aligned: "…charge your card for the remaining balance of your booking the week of your event."
7. **Cart drawer** cannot show a fee/tax-inclusive total (depends on choice). It shows subtotal + waiver + delivery only, with a note: "+7% tax and 4% online payment convenience fee if paid by card at checkout."
8. **PaymentStep summary** re-renders live as the customer toggles between options — fee row appears/disappears, tax recomputes, total recomputes.

---

## Execution order

### Step 1 — Database migration (schema only)

`supabase/migrations/<ts>_convenience_fee_v1.sql`:

```sql
-- 1. Settings: configurable convenience-fee rate, default 4%
alter table public.app_settings
  add column if not exists online_checkout_fee_rate numeric not null default 0.04;

-- Bump default deposit so DEPOSIT_NET ($5) lines up with the live charge ($5.45 in code).
update public.app_settings set default_deposit = 5 where id = 1;

-- 2. Bookings: persist convenience fee + payment-method choice + Stripe card-on-file refs
alter table public.bookings
  add column if not exists checkout_fee_amount numeric not null default 0,
  add column if not exists payment_method_choice text
    check (payment_method_choice in ('card_on_file','cash_on_delivery')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_payment_method_id text;

create index if not exists bookings_stripe_customer_id_idx
  on public.bookings(stripe_customer_id);

-- 3. Seed new balance-paid email template (non-destructive)
insert into public.email_templates (key, label, description, subject, body_html, enabled, use_custom)
values (
  'balance_paid_customer',
  'Balance paid — customer receipt',
  'Sent when the remaining online balance has been successfully captured by admin.',
  'Payment received — Orlando Inflatables booking #{{ref}}',
  '<p>Hi {{first_name}},</p><p>Your remaining balance of <strong>{{balance_paid}}</strong> has been received. You''re all set for <strong>{{event_date}}</strong>.</p>{{totals_block}}<p>Questions? Call {{phone}}.</p>',
  true,
  false
)
on conflict (key) do nothing;
```

Then a **separate** insert-tool call (cron, not migration, per the project rule about user-specific URL/anon-key data):

```sql
select cron.schedule(
  'purge-stale-pending-bookings',
  '0 * * * *',     -- top of every hour
  $$ delete from public.pending_bookings where created_at < now() - interval '6 hours'; $$
);
```

### Step 2 — Shared pricing helpers (conditional fee)

**New `supabase/functions/_shared/pricing.ts`** (server) — mirrored in **`src/lib/pricing.ts`** (client) so the math is identical:

```ts
export const DEPOSIT_NET = 5.00;
export const DEPOSIT_CHARGE = 5.45;

export type PaymentMethodChoice = 'card_on_file' | 'cash_on_delivery';

export interface PriceBreakdown {
  subtotal: number;
  damageWaiver: number;
  deliveryFee: number;
  checkoutFee: number;   // 0 for COD
  taxableBase: number;   // subtotal + waiver + delivery + checkoutFee
  tax: number;
  total: number;         // taxableBase + tax
}

export function computeBreakdown(
  subtotal: number, waiverSelected: boolean, deliveryFee: number,
  rates: { taxRate: number; waiverRate: number; checkoutFeeRate: number },
  paymentChoice: PaymentMethodChoice = 'card_on_file',
): PriceBreakdown {
  const r = (n: number) => Math.round(n * 100) / 100;
  const sub      = r(subtotal);
  const waiver   = waiverSelected ? r(sub * rates.waiverRate) : 0;
  const delivery = r(Math.max(0, deliveryFee));
  const preFee   = r(sub + waiver + delivery);
  const checkoutFee = paymentChoice === 'card_on_file'
    ? r(preFee * rates.checkoutFeeRate)
    : 0;
  const taxableBase = r(preFee + checkoutFee);
  const tax   = r(taxableBase * rates.taxRate);
  const total = r(taxableBase + tax);
  return { subtotal: sub, damageWaiver: waiver, deliveryFee: delivery,
           checkoutFee, taxableBase, tax, total };
}
```

`src/lib/pricing.ts` — replace existing `computeBreakdown` with a wrapper that pulls rates from `getSettings()` and accepts an optional `paymentChoice` (defaulting to `card_on_file` so any caller that has not yet been migrated shows the higher number, not a too-low one). Re-export `DEPOSIT_NET`, `DEPOSIT_CHARGE`. Existing callers (CartDrawer, ProductCard preview, etc.) will pass `cash_on_delivery` to render fee-free preview totals where appropriate — see Step 8.

`src/lib/appSettings.ts` + `supabase/functions/_shared/settings.ts` — add `onlineCheckoutFeeRate` to interfaces, defaults (`0.04`), select list (`...,online_checkout_fee_rate`), and hydration. Same edit in both places.

### Step 3 — `create-booking-checkout`

`supabase/functions/create-booking-checkout/index.ts`:

1. **Schema:** replace `payment_choice: z.enum(['deposit','full','custom','deposit_cash'])` + `custom_amount` with `payment_choice: z.enum(['card_on_file','cash_on_delivery'])`.
2. **Compute breakdown** server-side using new `computeBreakdown(...)` from `_shared/pricing.ts`, passing `d.payment_choice`. The fee inside `bd.checkoutFee` is 0 for COD.
3. **Find-or-create Stripe Customer** for `card_on_file` only:
   ```ts
   let customerId: string | undefined;
   if (d.payment_choice === 'card_on_file') {
     const found = await stripe.customers.list({ email: d.customer_email, limit: 1 });
     customerId = found.data[0]?.id
       ?? (await stripe.customers.create({
         email: d.customer_email, name: d.customer_name, phone: d.customer_phone,
         metadata: { source: 'orlandoinflatables.com', event_date: d.event_date },
       })).id;
   }
   ```
4. **Session create:** always `mode: 'payment'`, `unit_amount: 545`, label "Reservation deposit". For `card_on_file` add `customer: customerId` and `payment_intent_data.setup_future_usage: 'off_session'`. For COD omit both (no card retained).
5. **Stash `pending_bookings`:** include `payment_method_choice`, `checkout_fee_amount = bd.checkoutFee`, `amount_total = bd.total`, `stripe_customer_id` (or null). `amount_charged = 5.45`, `deposit_amount = 5.00`.
6. `$100` minimum stays on `subtotal` only.

### Step 4 — `_shared/finalizeBooking.ts`

1. Import `computeBreakdown` from `_shared/pricing.ts`. Recompute exactly the same way using `p.payment_choice` from the pending payload (so the booking row matches what the customer was shown).
2. Pull payment-method/customer off the expanded session:
   ```ts
   stripe_customer_id: typeof session.customer === 'string'
     ? session.customer
     : session.customer?.id ?? null,
   stripe_payment_method_id:
     typeof session.payment_intent === 'object'
       ? session.payment_intent?.payment_method ?? null
       : null,
   ```
3. Set `payment_method_choice = p.payment_choice`, `checkout_fee_amount = bd.checkoutFee`.
4. `amount_paid = 5.45`, `balance_due = max(0, total − 5.45)`, `payment_status = balance>0 ? 'deposit_paid' : 'paid_in_full'`.

### Step 5 — `payments-webhook` & `check-booking-status` (expand payment_intent)

In each handler, where the session is fetched before `finalizeBookingFromSession`, switch to:
```ts
const session = await stripe.checkout.sessions.retrieve(id, { expand: ['payment_intent'] });
```
2-line edit each. This guarantees `payment_method` is populated for card-on-file finalizes.

### Step 6 — `PaymentStep.tsx` (2 options, conditional fee row, conditional disclosure)

`src/components/booking/PaymentStep.tsx`:

- Replace the four-option group with a controlled `useState<'card_on_file' | 'cash_on_delivery'>('card_on_file')` (default to card-on-file so the first paint shows the higher total — no surprise).
- Drop `customAmount`, `customNum`, `customValid`, and the four old branches.
- `bd = computeBreakdown(subtotal, waiver, delivery, rates, choice)` — recomputed every render so the summary updates live as the radios toggle.
- `chargedToday = 5.45`, `balance = max(0, bd.total − 5.45)`.

Summary block, exact display order:

```tsx
<Row label="Subtotal"                                value={bd.subtotal} />
{waiver && <Row label="Damage Waiver (10%)"          value={bd.damageWaiver} />}
{deliveryRow}
{choice === 'card_on_file' && (
  <Row label="Online Payment Convenience Fee (4%)"   value={bd.checkoutFee} />
)}
<Row label="Sales Tax (7%)"                          value={bd.tax} />
<Row label="Order total" bold                        value={bd.total} />
<Row label="Charged today" muted                     value={5.45} />
<Row label={choice === 'cash_on_delivery'
            ? 'Remaining balance (cash on delivery)'
            : 'Remaining balance (charged the week of your event)'}
     muted value={balance} />
```

Two options:

```tsx
<Option value="card_on_file"
        label="Reserve with $5.45, remaining balance charged the week of your event"
        amount="$5.45" badge="Charged today: $5.45"
        sub="We'll charge your card the week of your event for the remaining balance" popular />
<Option value="cash_on_delivery"
        label="Reserve with $5.45, pay balance in cash on delivery"
        amount="$5.45" badge="Charged today: $5.45"
        sub="Bring exact cash for the remaining balance on event day" />
```

Authorization disclosure (only shown for card-on-file):

```tsx
{choice === 'card_on_file' && (
  <p className="text-xs text-muted-foreground mt-2">
    By providing your card, you authorize Orlando Inflatables to charge
    your card for the remaining balance of your booking the week of your event.
  </p>
)}
```

Copy: "$5 non-refundable deposit" → "$5.45 non-refundable deposit". `$50 cancellation fee` line stays (different concept). Disable rule: `loading || !agreed || belowMinimum`.

### Step 7 — `CheckoutModal.tsx`

1. Step-3 review summary (~lines 530-547): same conditional logic as Step 6 — fee row only when `paymentChoice === 'card_on_file'`, in the **Subtotal → Waiver → Delivery → [Convenience Fee] → Sales Tax → Total** order.
2. **Delete** `handleSubmit`, `submitting`, `setSubmitting`, and the `submit-booking` invoke at line 167.
3. PaymentStep invocation unchanged; the modal must pass through the live choice or read from PaymentStep's own state if Step-3 summary is rendered before PaymentStep mounts (currently it is — Step 3 summary is the *review* before payment, so the fee row will read from `paymentChoice` once that lifts to the modal). Implementation note: lift `paymentChoice` to `CheckoutModal` so both Step-3 and PaymentStep read the same value.

### Step 8 — Cart drawer copy + previews

`src/components/cart/CartDrawer.tsx`:

- Show **subtotal + waiver + delivery** only. Do **not** show a fee/tax-inclusive total (depends on choice the customer hasn't made yet).
- Replace the disclosure paragraph (~line 95) with:
  ```tsx
  <p className="text-xs text-muted-foreground">
    +7% sales tax and 4% online payment convenience fee if paid by card at checkout.
    Choose cash on delivery to skip the convenience fee.
  </p>
  ```
- Any other surface that previewed an "estimated total" with the old 3% should switch to the same fee-free preview pattern (none today as far as I've seen — flag any I find while building).

### Step 9 — Delete legacy `submit-booking`

- Delete `supabase/functions/submit-booking/index.ts` (and call `supabase--delete_edge_functions` for `submit-booking`).
- Delete `[functions.submit-booking]` block in `supabase/config.toml`.
- Delete the five `submit-booking` Deno tests in `supabase/functions/security-tests/edge_flow_test.ts` (lines 75-156-ish). Keep the file; trim only the four tests targeting the deleted function.

### Step 10 — Email totals helper

`supabase/functions/_shared/email.ts` `totalsBlock(b)`:

```ts
const feeLine = Number(b.checkout_fee_amount ?? 0) > 0
  ? `<tr><td style="color:#54657a;">Online Payment Convenience Fee (4%)</td>
       <td style="text-align:right;">${fmtMoney(b.checkout_fee_amount)}</td></tr>`
  : '';
return `<table ...>
  ${subtotalLine}${waiverLine}${deliveryLine}${feeLine}${taxLine}
  <tr><td><strong>Total</strong></td><td style="text-align:right;"><strong>${fmtMoney(b.total_amount)}</strong></td></tr>
  <tr><td>Amount paid</td><td style="text-align:right;">${fmtMoney(b.amount_paid)}</td></tr>
  ${balanceLine}
</table>`;
```

`BookingForEmail` interface gains `checkout_fee_amount?: number | null`. COD bookings have `checkout_fee_amount = 0`, so the row is naturally omitted — no template-level branching required.

### Step 11 — `admin-charge-balance` edge function

New `supabase/functions/admin-charge-balance/index.ts`:

```
POST { booking_id }   — admin auth required (verify caller has 'admin' role via has_role RPC)
1. SELECT booking; require stripe_customer_id, stripe_payment_method_id, balance_due > 0,
   payment_method_choice = 'card_on_file', payment_status != 'paid_in_full'.
2. stripe.paymentIntents.create({
     amount: round(balance_due * 100), currency: 'usd',
     customer, payment_method, off_session: true, confirm: true,
     description: `Balance for booking ${id} — ${customer_name} ${event_date}`,
     metadata: { booking_id, kind: 'balance_capture' },
   })
3. On succeeded → INSERT booking_payments (method='stripe_card_on_file',
   amount=balance_due, reference=pi.id) — trigger flips payment_status.
   Then send `balance_paid_customer` email via _shared/email.ts.
4. On requires_action / authentication_required → return 402 with PI client_secret
   and a short message; admin UI surfaces a toast asking admin to call/email customer.
   (Customer-facing 3DS retry email is OUT OF SCOPE this round.)
5. INSERT admin_audit_log row regardless of outcome.
```

### Step 12 — Admin UI: balance display + capture button

`src/pages/admin/Bookings.tsx`, `src/pages/admin/CustomerDetail.tsx`, and a small new component reused in both:

```tsx
const isCod  = booking.payment_method_choice === 'cash_on_delivery';
const canCharge = !isCod
  && booking.stripe_customer_id
  && booking.stripe_payment_method_id
  && Number(booking.balance_due) > 0;

<div className="rounded-md border p-3 space-y-2">
  <p className="text-sm font-semibold">
    {isCod
      ? 'Cash balance pending'
      : 'Online balance pending — capture in Stripe'}
  </p>
  <p className="text-2xl font-bold">${Number(booking.balance_due).toFixed(2)}</p>
  {canCharge ? (
    <Button onClick={chargeBalance}>Charge balance now</Button>
  ) : isCod ? (
    <Button variant="outline" onClick={openRecordPaymentDialog}>
      Mark cash collected
    </Button>
  ) : (
    <p className="text-xs text-muted-foreground">
      No saved card on file. Record payment manually below.
    </p>
  )}
</div>
```

`chargeBalance` invokes `admin-charge-balance`, toasts the result (including the 402 "needs customer authentication" path), and refetches the booking.

### Step 13 — Admin Settings page

`src/pages/admin/Settings.tsx`: add a numeric input labeled **"Online Payment Convenience Fee Rate"** (placeholder `0.04`, helper text "Charged only when customer chooses to pay balance online by card. Stored as a decimal — 0.04 means 4%."). Persists via the existing `app_settings` upsert.

### Step 14 — Verification

1. `tsc --noEmit` (auto via harness).
2. End-to-end in test mode with $200 subtotal + $20 waiver + $35 delivery:
   - **Card-on-file path:** fee = $10.20, taxable base = $265.20, tax = $18.56, **total = $283.76**, balance after $5.45 = **$278.31**. Confirm row appears in PaymentStep, CheckoutModal Step 3, and the customer + admin emails.
   - **COD path:** fee = $0, taxable base = $255, tax = $17.85, **total = $272.85**, balance after $5.45 = **$267.40**. Confirm fee row absent in all three surfaces and in emails.
3. Toggle radios live in PaymentStep — fee row, tax, total, balance all update instantly.
4. After card-on-file checkout completes: query `bookings` row → `stripe_customer_id` and `stripe_payment_method_id` populated, `payment_method_choice = 'card_on_file'`, `checkout_fee_amount = 10.20`. After COD checkout: those three fields are null/null/`cash_on_delivery`/0.
5. Admin booking page: card-on-file booking shows "Online balance pending — capture in Stripe" + "Charge balance now". Click → `admin-charge-balance` succeeds → second `booking_payments` row → `payment_status = 'paid_in_full'` → `balance_paid_customer` email arrives.
6. COD booking shows "Cash balance pending" + "Mark cash collected" (opens existing `RecordPaymentDialog`).
7. `pending_bookings` row inserted manually with `created_at = now() − 7h` → gone after the next hourly cron tick.
8. `curl https://…/functions/v1/submit-booking` → 404.

### Step 15 — Memory updates (during build)

Update `mem://features/pricing-tax-and-damage-waiver` and `mem://features/booking-system` to record:
- $5.45 deposit / $5.00 net credit
- 4% Online Payment Convenience Fee — card-on-file only, taxable
- Two-option PaymentStep
- Card-saving via `setup_future_usage: off_session`
- Admin "Charge balance now" capture flow
- Hourly 6-hour purge of `pending_bookings`

---

## Out of scope

- 3DS/SCA retry email for `requires_action` off-session charges (return 402, admin handles manually for now).
- Refund tooling. Cancellation copy stays "non-refundable."
- Backfill for pre-existing bookings — they keep `checkout_fee_amount = 0` and `payment_method_choice = null`; admin UI treats them as legacy and routes to the existing `RecordPaymentDialog`.

Approve and I'll start at Step 1.