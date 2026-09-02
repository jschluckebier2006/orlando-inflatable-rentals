// Single source of truth for how long a rental occupies inventory.
//
// The checkout availability pre-check and the finalize step MUST agree on this
// range. When they drifted (pre-check spanned Sat->Mon while finalize wrote
// Sat->Sun), weekend rentals were refused for dates that were actually free.

/** Extra calendar days beyond the start date that the rental occupies. */
export function rentalSpanDays(durationType: string): number {
  return durationType === "7hour" ? 0 : 1;
}

/**
 * Inclusive end date (YYYY-MM-DD) for a rental starting on `startDate`.
 * - 7hour     -> same day
 * - overnight -> next day
 * - weekend   -> Saturday delivery, Sunday pickup (next day)
 */
export function rentalEndDate(startDate: string, durationType: string): string {
  const start = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return startDate;
  start.setUTCDate(start.getUTCDate() + rentalSpanDays(durationType));
  return start.toISOString().slice(0, 10);
}
