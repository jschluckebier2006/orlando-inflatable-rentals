# Admin Bookings Dashboard Expansion

Add two new sections at the top of `/admin/bookings`, above the existing table:

1. **Monthly calendar** — each day cell shows total rented items (sum of `booking_items` count) for confirmed + pending bookings on that date.
2. **Next 7 days list** — every confirmed/pending booking in the upcoming week with date, customer name, phone, full address, items, and status.

## What it will look like

```text
+----------------------- Admin / Bookings ------------------------+
| [< Nov 2026 >]                                                  |
| Sun  Mon  Tue  Wed  Thu  Fri  Sat                               |
|  -    -    -    1    -    -    2                                |
|  -    3    -    -    5    -    1     <- number = total items   |
|  ...                                                            |
+-----------------------------------------------------------------+
| Next 7 Days                                                     |
| Nov 7  John Smith   (407) 555-1234   123 Main St, Orlando 32801 |
|        Items: Bounce House, Combo Slide        [confirmed]      |
| Nov 8  Jane Doe     ...                                         |
+-----------------------------------------------------------------+
| [existing filter + bookings table stays below]                  |
+-----------------------------------------------------------------+
```

## Implementation

**File: `src/pages/admin/Bookings.tsx`**
- Reuse the `bookings` state already loaded (it includes `booking_items`, `event_date`, `event_end_date`, status, customer fields).
- Build a `Map<dateString, totalItems>` by iterating bookings filtered to `status in (confirmed, pending)`. For multi-day bookings (`event_end_date`), count items on every date in the range.
- New component `BookingsCalendar` (inline or `src/components/admin/BookingsCalendar.tsx`):
  - Month grid built from `date-fns` (`startOfMonth`, `endOfMonth`, `eachDayOfInterval`, plus padding to align Sun–Sat).
  - Prev/next month buttons, "Today" button.
  - Each cell: day number top-left; if `count > 0`, a centered badge with the count using the bright-blue theme color. Empty days are muted.
  - Clicking a day scrolls to / filters the table below to that date (nice-to-have; included).
- New component `UpcomingWeekList` (inline or `src/components/admin/UpcomingWeekList.tsx`):
  - Filters bookings where `event_date` is between today and today+7 days, status confirmed/pending.
  - Sorted ascending. Each row shows: formatted date, customer name, `tel:` phone link, `event_address_line, event_city event_zip`, comma-joined `booking_items` names with quantities, and the existing status badge.
  - Empty state: "No bookings in the next 7 days."

No DB schema changes, no new edge functions, no new dependencies — `date-fns` is already in use.

## Out of scope
- Editing bookings from the calendar (still done in the table below).
- Revenue / payment totals on the calendar (per your choice: item count only).
- Cancelled or awaiting_payment bookings (excluded per your choice).
