# L06 — Circuit breakers + bulkheads (DONE, runtime verify needs JDK 21)

## What changed
- `notification`: `@CircuitBreaker("mailSend")` stacked on `sendOrderConfirmationEmail` next to L05's `@Retry` (Retry outer, Breaker inner — each attempt feeds the breaker). Yml: count-based window 10, min 5 calls, 50% threshold, 30s open, 3 half-open probes, same record/ignore exceptions as the retry. **No fallback** — see below. Health: breaker state visible at `/actuator/health` (`show-details: always`, lab-only).
- `analytics`: `resilience4j` + `aop` deps; `@Bulkhead("analyticsDb")` on `EventServiceImpl.trackEvent` (yml: 10 concurrent, `max-wait 0` fail-fast); `EventController` maps `BulkheadFullException` → **429**. Bulkhead health enabled.
- Each pattern lives in exactly one place: breaker on mail, bulkhead on analytics. No breaker on analytics, no bulkhead on mail.

## Why no fallback on the mail breaker (deliberate)
A fallback that acked the record would silently drop order confirmations — data loss dressed as resilience. The honest fallback here is a dead-letter queue, which doesn't exist yet (L07). So the open breaker throws `CallNotPermittedException` → listener rethrows → offset uncommitted → redelivery after restart. Fail-fast + safe, just slower. L07 gives it a real fallback target.

## Why bulkhead on `trackEvent`, not the listener
The listener is single-threaded per partition — a bulkhead there would never trip and would be decorative config. `trackEvent` also serves `POST /api/v1/analytics/events` (real HTTP concurrency), so one annotation guards the DB pool from bursts on both paths. Bulkhead protects a *shared resource*, not a code path — place it where the resource is touched.

## Labs
1. **Breaker trip:** SMTP black hole, produce 6+ orders. First ~5 mails burn full retry budgets (slow), then breaker opens: `CallNotPermittedException` immediately, `/actuator/health` shows `mailSend: OPEN`. Wait 30s → 3 half-open probes → closes if SMTP back.
2. **Auth is not a breaker event:** bogus credentials → ignored by policy, breaker stays CLOSED. Breakers count *transient* failure; deterministic failure must never trip them.
3. **Bulkhead shed:** 20 parallel `POST /api/v1/analytics/events` → some 200, excess 429. Watch `resilience4j_bulkhead_available_concurrent_calls` in Prometheus.
4. Review question: why does the 429 mapping live in the controller, not the service? (Answer: HTTP semantics belong at the edge; the Kafka path hitting the same bulkhead must throw, not return status codes.)

## Concepts
Closed/Open/Half-open lifecycle, failure-rate vs slow-call-rate windows, bulkhead as bulkhead (ship compartments), fail-fast vs queue-full (max-wait 0 vs >0), backpressure signaling (429 + `Retry-After` in prod), breaker metrics as the L10 dashboard seed.
