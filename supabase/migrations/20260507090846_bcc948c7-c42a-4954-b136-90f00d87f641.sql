
create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.email_send_log (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  template_name text not null,
  recipient_email text not null,
  status text not null default 'sent',
  resend_message_id text,
  error_message text,
  related_booking_id uuid,
  related_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists email_send_log_template_idx on public.email_send_log(template_name);
create index if not exists email_send_log_booking_idx on public.email_send_log(related_booking_id);

alter table public.email_send_log enable row level security;

create policy "admins read email log"
on public.email_send_log for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Schedule recurring jobs that hit the scheduled-email-runner edge function.
-- Service role key is used to authorize invocation.
select cron.schedule(
  'abandoned-cart-scan',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://wwyyfgngdwaabzwzvlml.supabase.co/functions/v1/scheduled-email-runner',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eXlmZ25nZHdhYWJ6d3p2bG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODU4MDgsImV4cCI6MjA5MjM2MTgwOH0.YpNif5p6jRy-Ga0Pit7XsY3BsRjKUcjTD0fPNrV1fzQ'
    ),
    body := jsonb_build_object('job','abandoned_cart')
  );
  $$
);

select cron.schedule(
  'day-before-reminder',
  '0 16 * * *',
  $$
  select net.http_post(
    url := 'https://wwyyfgngdwaabzwzvlml.supabase.co/functions/v1/scheduled-email-runner',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eXlmZ25nZHdhYWJ6d3p2bG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODU4MDgsImV4cCI6MjA5MjM2MTgwOH0.YpNif5p6jRy-Ga0Pit7XsY3BsRjKUcjTD0fPNrV1fzQ'
    ),
    body := jsonb_build_object('job','day_before_reminder')
  );
  $$
);

select cron.schedule(
  'post-event-review-request',
  '0 9 * * *',
  $$
  select net.http_post(
    url := 'https://wwyyfgngdwaabzwzvlml.supabase.co/functions/v1/scheduled-email-runner',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eXlmZ25nZHdhYWJ6d3p2bG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODU4MDgsImV4cCI6MjA5MjM2MTgwOH0.YpNif5p6jRy-Ga0Pit7XsY3BsRjKUcjTD0fPNrV1fzQ'
    ),
    body := jsonb_build_object('job','post_event_review')
  );
  $$
);
