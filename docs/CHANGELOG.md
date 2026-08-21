# Changelog

Dated, newest first. Add an entry whenever you ship a change here.

---

## 2026-08-19 — Cash-payment confirmation wired up (Batch 3)

The Staff Panel could end a trip and see it sit at `payment_pending` forever if the rider chose cash — there was no UI path to actually confirm a cash payment, even though both backend endpoints for it already existed and worked correctly.

- In the poll loop, a `payment_pending` trip now triggers a `GET /staff/trip/{tripId}/cash-payment-summary` lookup. A 404 (not a cash payment — e.g. still-pending Chapa) falls through to the original 5s re-poll, unchanged. A found cash payment stops polling and shows a **Confirm Cash Payment** panel (rider name + ETB amount).
- Confirming calls `POST /staff/confirmCashPaymentByTripId/{tripId}`, then opens the existing `TripReceiptStaff` dialog — same receipt UI the Chapa path already used.

No backend changes needed — `PaymentController::checkCashPayment` and `ChapaController::confirmCashPaymentByTrip` were both already correct, just never called from here.

**Verified live**: created a real active trip + cash `Payment` row via `tinker` (mirroring what `POST /user/cash_payment` produces), drove the actual staff login → end-trip → confirm-cash-payment flow through the browser, confirmed the DB landed on `trip.status=completed` / `payment.status=success` / `confirmed_by` set. Separately confirmed a non-cash trip just keeps polling every 5s with no UI change — no regression to the Chapa path. `tsc --noEmit` and `npm run build` both clean.

Commit: `14cd25e` on `TeamirA/greenwheels-cycle-hub`.

## 2026-08-19 — Reconnected to production, StaffPanel fixed (Batch 2)

Two separate problems, found and fixed together:

**Hardcoded to localhost.** Every page called `http://127.0.0.1:8000` directly — 61 occurrences across 28 files — so this console could only ever talk to a developer's own machine, never a real deployment. Added [`lib/config.ts`](../src/lib/config.ts) (`API_BASE_URL`, sourced from `VITE_API_BASE_URL`), added `.env.example`, gitignored `.env`, and mechanically replaced every hardcoded occurrence.

**`StaffPanel.tsx` couldn't render trip details at all.** Root cause was on the backend — `TripController::startTrip` only returned full trip/bike/user data on some of its 4 success paths (fixed in [`Green-Wheel`'s changelog](../../Green-Wheel/docs/CHANGELOG.md), commit `870abaf`). On the frontend side, fixed alongside it:
- `bikeDetails` population in `StaffPanel.tsx` — this was the actual rendering blocker.
- A field-naming mismatch: the frontend expected `bike.category` / `"in-use"` (hyphen), the backend actually sends `brand` / `in_use` (underscore) — fixed in two places.
- `StaffPanel` was fetching the nonexistent `/api/bikes` (the real route is `/api/all_bikes`), which left "Active Bikes by Station" silently always empty.
- `bike.id.toLowerCase()` — a crash risk, since `id` is numeric, not a string.
- A `station_id` filter that could never match, because the backend returns `station_name`, not `station_id`.
- `ActiveRides.tsx`'s live-tracking default flipped from mock to real data; its dev-only toggle gate switched from `process.env.NODE_ENV` (doesn't reliably exist in a Vite bundle) to `import.meta.env.DEV`.

**Verified live**: full login → verify-trip → end-trip cycle driven through an actual browser against a running local backend — screenshots confirmed the bike-details panel and bike list both render with real data. `tsc --noEmit` and `npm run build` both clean.

Commit: `40c0f62` on `TeamirA/greenwheels-cycle-hub`.

**Found but not fixed in this pass**: `StaffPanel.tsx` also fetches `/api/reservations` (same nonexistent-route issue as the old `/api/bikes` call) — left alone because the state it sets is dead code, never rendered. Also saw a recurring `"No station ID found in localStorage"` console error from some other bundled hook — not chased down.
