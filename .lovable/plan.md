# Plan: 7-Hour Rental — auto-constrain pickup time

Scope: `src/components/booking/CheckoutModal.tsx` Step 2 (time selection) only. Overnight and weekend logic untouched.

## Changes

1. **Limit delivery start times for 7-hour rentals.**
   In the Delivery / start time `<Select>` (lines 308–313), filter `TIME_SLOTS` to slots where `value <= "13:00"` (1:00 PM latest, so start+7h ≤ 8:00 PM). All other durations keep the full slot list.

2. **Auto-set pickup to start + 7h.**
   When `duration === "7hour"` and `form.event_start_time` changes, set `form.event_end_time` to start + 7 hours (string math on `HH:MM`: `hh = parseInt(start.slice(0,2)) + 7`, keep minutes). Implement via a small helper `addSevenHours(hhmm)` and either:
   - call it inside the `onValueChange` of the start-time Select, **and**
   - back it up with a `useEffect([duration, form.event_start_time])` that resyncs `event_end_time` whenever a start time is present for a 7-hour rental (covers the case where the user previously had a stale end time from another duration).

3. **Lock the Pickup field.**
   Replace the Pickup `<Select>` (lines 316–325) with a read-only `<Input value={form.event_end_time ? labelFor(form.event_end_time) : ""} readOnly disabled />`, matching the pattern already used for overnight (line 347) and weekend (line 366). This removes the dropdown entirely for 7-hour and eliminates the `t.value > form.event_start_time` filter.

4. **Update helper text** (line 303):
   From: `"Choose your delivery (start) time and pickup time. We deliver and pick up between 8:00 AM and 8:00 PM."`
   To:   `"7-Hour Rental: choose a start time between 8:00 AM and 1:00 PM. Pickup will be exactly 7 hours after delivery."`

5. **Default start time** for 7-hour: currently no default is set in the `useEffect` at lines 78–90 (only overnight/weekend get defaults). Leave that alone — the placeholder `"Select start time"` continues to work, and as soon as the user picks one, the pickup auto-fills.

## Out of scope
- `canContinueStep1` validation at line 156 — the `event_end_time > event_start_time` check still passes since +7h is always later.
- Overnight (`duration === "overnight"`) and weekend branches — no edits.
- Edge functions, pricing, schema, admin BookingFormModal.
- Any other file.

## Edge cases
- User switches duration 7hour → overnight → 7hour: the new `useEffect` resync recomputes `event_end_time` from current start time (or clears it if start is empty).
- User has a stale start time > 13:00 from a previous flow: since the Select options are filtered, the trigger will show the raw value but won't be re-selectable. Acceptable — they'll pick a new valid one. (Optional safety: also clear `event_start_time` in the useEffect if it exceeds `"13:00"` while duration is `"7hour"`. Recommended; will include.)

## Risks
Low. UI-only change inside one branch of one modal. No data model, no server contract change. Pickup time still submitted as `event_end_time` in the same payload at line 536.
