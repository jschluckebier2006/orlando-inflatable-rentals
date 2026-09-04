# Roadmap

- [x] Backfill reconstructed audit entry for Megan Pahl's pre-trigger deletion
- [x] Add admin-only permanent purge path for paid bookings (RPC + guard bypass scoped to one booking)
- [x] Add "Permanently delete" dialog in admin bookings (typed confirm + reason, Stripe charge note)
- [x] End-to-end verification: guard still blocks plain deletes; reconciler excludes purged bookings
- [x] Answered: customer record, email history and audit snapshot survive a purge (optional customer removal deferred)
