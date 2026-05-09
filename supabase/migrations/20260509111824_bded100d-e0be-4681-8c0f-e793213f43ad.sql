
CREATE TABLE public.email_templates (
  key text PRIMARY KEY,
  label text NOT NULL,
  description text,
  subject text NOT NULL,
  body_html text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  use_custom boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads email templates" ON public.email_templates
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write email templates" ON public.email_templates
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.email_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  saved_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_template_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read template versions" ON public.email_template_versions
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins insert template versions" ON public.email_template_versions
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_template_versions_key ON public.email_template_versions (template_key, created_at DESC);

-- Seed the 7 templates with editable bodies. Merge tags use {{name}} syntax.
-- Bodies contain ONLY the inner content; layout chrome (header/footer) is added at send time.
INSERT INTO public.email_templates (key, label, description, subject, body_html) VALUES
('booking_confirmed_customer',
 'Booking Confirmed → Customer',
 'Sent to the customer when a booking is paid and confirmed. Includes event details, items, totals, and balance due.',
 'Booking confirmed for {{event_date}} · #{{ref}}',
 '<h1 style="margin:0 0 8px;font-size:22px;">Booking confirmed!</h1>
<p style="margin:0 0 16px;color:#54657a;">Hi {{first_name}}, thanks for booking with Orlando Inflatables. Your reservation is locked in.</p>
<p style="margin:0 0 16px;font-size:13px;color:#54657a;">Booking ref: <strong>#{{ref}}</strong></p>
<h2 style="font-size:16px;margin:20px 0 8px;">Event details</h2>
{{details_block}}
<h2 style="font-size:16px;margin:24px 0 4px;">Your rentals</h2>
{{items_block}}
{{totals_block}}
<p style="margin:24px 0 0;font-size:13px;color:#54657a;">Need to make a change? Reply to this email or call <strong>{{phone}}</strong>. Cancellations 7+ days before your event are fully refundable; weather-related cancellations on event day receive a full credit.</p>'),

('booking_new_admin',
 'New Booking → Admin',
 'Internal alert sent to the admin team when a new booking is created.',
 '🎉 New booking · {{customer_name}} · {{event_date}}',
 '<h1 style="margin:0 0 8px;font-size:20px;">New booking #{{ref}}</h1>
<p style="margin:0 0 12px;"><strong>{{customer_name}}</strong> · {{customer_email}} · {{customer_phone}}</p>
{{details_block}}
<h2 style="font-size:15px;margin:20px 0 4px;">Items</h2>
{{items_list}}
<p style="font-size:14px;"><strong>Total:</strong> {{total}} · <strong>Paid:</strong> {{paid}} · <strong>Balance:</strong> {{balance}}</p>
{{notes_block}}
{{stripe_block}}'),

('booking_reschedule_customer',
 'Reschedule → Customer',
 'Sent to the customer when an admin changes the event date.',
 'Booking rescheduled · {{event_date}} · #{{ref}}',
 '<h1 style="margin:0 0 8px;font-size:22px;">Your booking date has changed</h1>
<p style="margin:0 0 16px;color:#54657a;">Hi {{first_name}}, your Orlando Inflatables reservation has been rescheduled. Here are the new details — please save them.</p>
<p style="margin:0 0 16px;font-size:13px;color:#54657a;">Booking ref: <strong>#{{ref}}</strong></p>
{{reschedule_block}}
<p style="margin:24px 0 0;font-size:13px;color:#54657a;">If this date doesn''t work, please reply to this email or call <strong>{{phone}}</strong> right away so we can sort it out.</p>'),

('booking_reschedule_admin',
 'Reschedule → Admin',
 'Internal alert sent when an admin reschedules a booking. Highlights conflict overrides.',
 '{{override_emoji}}Rescheduled · {{customer_name}} · {{event_date}}',
 '<h1 style="margin:0 0 8px;font-size:20px;">Booking rescheduled · #{{ref}}</h1>
<p style="margin:0 0 8px;"><strong>{{customer_name}}</strong> · {{customer_email}} · {{customer_phone}}</p>
{{override_block}}
<p style="font-size:14px;margin:8px 0;"><span style="color:#54657a;">From:</span> <s>{{old_dates}}</s><br>
<span style="color:#54657a;">To:</span> <strong>{{new_dates}}</strong></p>
<p style="font-size:13px;color:#54657a;">Changed by {{actor_email}}.</p>'),

('cart_abandoned_admin',
 'Abandoned Cart → Admin',
 'Internal alert sent ~30 minutes after a customer reaches checkout but doesn''t complete payment.',
 '🛒 Abandoned cart · {{customer_name}} · {{event_date}}',
 '<h1 style="margin:0 0 8px;font-size:20px;">Abandoned checkout</h1>
<p style="margin:0 0 12px;color:#54657a;">A customer reached checkout but didn''t complete payment ~30 min ago. Worth a quick call.</p>
<p><strong>{{customer_name}}</strong><br>
📧 {{customer_email}}<br>
📞 <a href="tel:{{customer_phone}}">{{customer_phone}}</a></p>
<p><strong>Requested date:</strong> {{event_date}}</p>
<h2 style="font-size:15px;margin:16px 0 4px;">Cart</h2>
{{items_list}}
<p style="font-size:14px;"><strong>Cart total:</strong> {{cart_total}}</p>'),

('event_reminder_customer',
 'Day-Before Reminder → Customer',
 'Friendly reminder sent the day before the event.',
 'Reminder: your rental is tomorrow · {{event_date}}',
 '<h1 style="margin:0 0 8px;font-size:22px;">See you tomorrow!</h1>
<p style="margin:0 0 16px;color:#54657a;">Hi {{first_name}}, just a friendly reminder that your Orlando Inflatables rental is tomorrow.</p>
{{details_block}}
<p style="margin:20px 0 0;font-size:14px;">Please make sure the delivery area is clear, accessible, and within ~75 ft of a working outlet. If weather looks rough, give us a call at <strong>{{phone}}</strong> — same-day weather cancellations get full credit toward a future booking.</p>'),

('review_request_customer',
 'Review Request → Customer',
 'Sent the day after the event asking for a Google review.',
 'How was your Orlando Inflatables rental?',
 '<h1 style="margin:0 0 8px;font-size:22px;">Thanks for renting with us!</h1>
<p style="margin:0 0 16px;color:#54657a;">Hi {{first_name}}, we hope yesterday''s event was a blast. If you have a minute, a Google review means the world to our small family business.</p>
<p style="text-align:center;margin:28px 0;">
  <a href="{{review_url}}" style="background:#1e88ff;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;display:inline-block;">Leave a Google Review</a>
</p>
<p style="margin:0;font-size:13px;color:#54657a;">Thank you again — we can''t wait to bounce with you next time!</p>');
