## Prioritized Roadmap — Orlando Inflatables admin

Phases are ordered by leverage (impact ÷ effort). You can ship each phase independently and stop/reorder anytime. SMS is intentionally excluded per your direction.

---

### Phase 1 — Quick wins already half-built (1 short session)

1. **Wire up the Inventory tab.** Add `/admin/inventory` and `/admin/inventory/:id` routes plus a sidebar link. The pages and DB tables already exist; they're just not reachable.
2. **Storefront reads from the inventory DB.** Switch product pages from the static `src/data/inventory.ts` to `inventory_items` + `inventory_images` so admin edits go live instantly. Keep a small in-memory fallback for SEO.
3. **Editable Settings page.** Make tax %, damage waiver %, default deposit, and delivery-zone zips/fees editable from the UI (new `app_settings` + `delivery_zones` tables). Removes the "ask the developer" footer.

---

### Phase 2 — Email management hub (your explicit ask)

A new `/admin/emails` section with three tabs:

- **Templates tab** — list every template the system can send (booking confirmed, new-booking admin alert, reschedule customer/admin, day-before reminder, abandoned-cart, review request, plus future ones). Click a template to edit:
  - Subject line (with merge tags like `{{customer_name}}`, `{{event_date}}`, `{{balance_due}}`)
  - Body (rich-text editor, brand-styled preview pane on the right)
  - Toggle on/off per template
  - "Send test to me" button
  - Version history (rollback any prior revision)
- **Logs tab** — replaces the current `/admin/notifications` page; shows every send across all templates with deduped status, recipient, error, and a "Resend" button.
- **Schedules tab** — control the timing of automated emails (e.g., reminder = X days before event, review request = Y days after; abandoned-cart = Z hours).

Implementation: new `email_templates` table (name, subject, html, enabled, updated_at, updated_by) and `email_template_versions` for history. Edge functions read from the DB instead of hard-coded strings in `_shared/email.ts`.

---

### Phase 3 — Money tools

4. **"Send payment request" button** on a booking → emails the customer a hosted Stripe link for the remaining balance.
5. **Refunds in-app** (full + partial), recorded as negative `booking_payments` and synced to Stripe.
6. **Auto balance-due reminders** at 14 / 7 / 2 days before the event (uses the existing `scheduled-email-runner` cron and the new template system).
7. **Promo codes & discounts** as line items, manageable from admin.
8. **PDF invoices/receipts** generated server-side; auto-attached link in payment emails; downloadable from each booking.
9. **AR-aging report** — outstanding balances grouped by days overdue.

---

### Phase 4 — Calendar & operations

10. **Drag-to-reschedule** on the month/week grid (routes through your existing `RescheduleDialog` validation).
11. **Multi-day rentals as bars** spanning days; **color by item, not status**; add a **resource swimlane view** (one row per item) for utilization at a glance.
12. **Right-click → blackout this date** for a specific item.
13. **Read-only iCal feed** so the calendar shows up in Google/Apple calendar on your phone.
14. **Driver run-sheet** for a chosen day: stops in delivery order, addresses, gate codes, contact phone, items, setup notes, photos. Mobile-friendly and printable. Driver checklist (arrived → setup photo → blower running → leave; pickup damage check + photo).
15. **Weather alert banner** on the calendar 2 days out (NOAA API) so you can proactively call water-slide customers about thunderstorms.

---

### Phase 5 — Bookings UX

16. **Bulk actions** on the bookings table (confirm, cancel, send reminder, export CSV).
17. **Saved quick filters**: This week, Unpaid, Awaiting confirmation, Past with no completion.
18. **Duplicate booking** for repeat customers.
19. **Internal vs. customer-visible notes** as separate fields.
20. **File attachments per booking** (signed waiver, COI for venue, site photos).
21. **Auto status transitions**: pending → confirmed when deposit hits; confirmed → completed the morning after.
22. **E-sign waiver flow** — hosted signing page, signed PDF stored on the booking.

---

### Phase 6 — CRM

23. **Customer LTV stats** (lifetime spend, # bookings, last booked, avg ticket) on the customer detail page.
24. **Tags** (VIP, School, HOA, Bad payer, No setup space).
25. **Merge duplicate customers** (same email/phone).
26. **Marketing-list export** filtered by tag, last-booked, zip — for a one-off email blast outside the transactional system.
27. **One-click rebooking** from a customer profile ("Book again — same items, new date").

---

### Phase 7 — Inventory analytics & packaging

28. **Utilization analytics per item** (booked days / available days, revenue per item).
29. **Maintenance schedule + reminders** (blower service every 90 days, vinyl patch log).
30. **Dead-stock report** — items not booked in 60/90 days.
31. **Bundle/package products** (e.g. "Birthday Bundle: 1 bouncer + 8 chairs") with bundle pricing.
32. **Add-on suggestions** at checkout (generators, sandbags, extension cords).

---

### Phase 8 — Reporting & analytics

33. **Revenue dashboard** (MTD/YTD, by category, by city/zip, repeat vs. new).
34. **Delivery-zone heatmap** to inform expansion.
35. **Lead-time histogram** (days from booking to event) for staffing.
36. **Conversion funnel**: cart → checkout → paid (logs abandoned carts you already track).

---

### Phase 9 — Roles & safety

37. **Multiple admin users + roles** (owner, dispatcher, driver) — `user_roles` table is ready, just no UI to invite/manage.
38. **Audit log of admin actions** (who edited what, when) — extend `booking_activity` to cover inventory and template edits.
39. **COI / insurance certificate generator** for venues (schools, parks, HOAs).

---

### Phase 10 — Customer self-service portal

40. **Tokenized booking link** in confirmation emails → customer can view booking, pay balance, sign waiver, request reschedule, all without logging in.
41. **Real-time availability check on product pages** that respects blackouts + stock counts the same way the double-booking trigger does.

---

## Recommended order to actually ship

If you want my pick: **Phase 1 → Phase 2 (emails) → Phase 3 (money) → Phase 4 (operations).** Phases 5–10 then become smaller, optional polish you can pick from à la carte.

Approve this and I'll start with Phase 1.