## Add "Delete" booking action with typed confirmation

Add a destructive Delete action to each row in the admin bookings table (`src/pages/admin/Bookings.tsx`) that permanently removes the booking and all related child records.

### UI changes (Bookings.tsx)

- Add a red `variant="destructive"` "Delete" button to the action button group in the Date cell, shown for every booking regardless of status (alongside View / Edit / Confirm / Complete / Cancel).
- Add a new `AlertDialog` controlled by `deleteTarget: Booking | null` and `deleteConfirmText: string` state.
- Dialog content:
  - Title: "Delete this booking?"
  - Body: "Are you sure you want to delete this booking? This action can't be undone."
  - Show the booking's customer name and event date (formatted like the row) so the admin can verify.
  - A labeled text `Input` asking them to type `DELETE` to confirm.
  - Footer: `AlertDialogCancel` ("Cancel") + a destructive confirm button labeled "Delete booking".
- The confirm button is `disabled` unless `deleteConfirmText === "DELETE"` (case-sensitive exact match).
- Reset `deleteConfirmText` whenever the dialog opens/closes.

### Delete logic

A new `confirmDelete()` async function that, for `deleteTarget.id`:

1. Deletes child rows first to avoid orphans:
   - `booking_items` where `booking_id = id`
   - `booking_payments` where `booking_id = id`
   - `booking_activity` where `booking_id = id`
2. Deletes the `bookings` row.
3. On success: remove the booking from local `bookings` state (so the table refreshes immediately), close the dialog, and toast "Booking deleted".
4. On error: toast the error, keep the dialog open, do not mutate state.

Per the user's requirement, do NOT write an `admin_audit_log` or `booking_activity` entry for the deletion — leave no trace.

### Notes

- No database schema changes needed; existing admin RLS policies already allow `DELETE` on `bookings`, `booking_items`, `booking_payments`, and `booking_activity`.
- No changes outside `src/pages/admin/Bookings.tsx`.
