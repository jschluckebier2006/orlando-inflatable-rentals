
alter table public.app_settings
  add column if not exists online_checkout_fee_rate numeric not null default 0.04;

update public.app_settings set default_deposit = 5 where id = 1;

alter table public.bookings
  add column if not exists checkout_fee_amount numeric not null default 0,
  add column if not exists payment_method_choice text
    check (payment_method_choice in ('card_on_file','cash_on_delivery')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_payment_method_id text;

create index if not exists bookings_stripe_customer_id_idx
  on public.bookings(stripe_customer_id);

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
