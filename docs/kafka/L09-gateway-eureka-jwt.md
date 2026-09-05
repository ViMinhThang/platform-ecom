# L09 — Gateway + Eureka + JWT edge (DONE, runtime verify needs JDK 21)

## What changed
- `eureka/` (new module): registry only — `@EnableEurekaServer`, `:8761`, self-registration off. No business logic.
- `gateway/` (new module, `:8080`): **the only externally reachable service.**
  - Prefix routes → `lb://order-service | inventory-service | analytics-service | notification-service` (paths pass through unchanged, no rewrites).
  - `JwtAuthFilter` (GlobalFilter, order −100): Bearer JWT → verified → `X-User-Id` forwarded. Open: `/labs/*`, `/actuator/*`. Everything else without a valid token → 401. Downstream services never see tokens.
  - `TokenController POST /labs/token?userId=1`: mints tokens with NO credential check — lab scaffolding, explicitly never-for-prod.
  - `LabRateLimitFilter` (GlobalFilter, order −50): fixed-window 100 req/10s per client IP, 429 + `Retry-After`. In-memory.
- 4 services: + `eureka-client` dep (BOM already present, no versions added) + 5-line `defaultZone` block (`${EUREKA_URI}` override for docker).
- `docker-compose.yml`: `eureka` + `gateway` (multi-stage Dockerfiles, context `platform-ecom-backend`). Compose exposes only `:8080` (gateway), `:8761` (dashboard), `:9080` (Kafka-UI) — services stay host-run via bootRun for labs.
- `configserver` stays deleted: per-service local yml survived the whole path and proved sufficient; central config deferred with reasons (see below).

## Deliberate ceilings (ladder)
1. **In-memory rate limit, not Redis.** Per-instance counters: two gateway replicas each allow the full quota. Shared quota needs Redis — which was deleted for one filter's sake. Correct at lab scale (single instance), documented for prod.
2. **Mint endpoint instead of login.** Real auth (passwords, refresh, revocation) is a product, not a lesson. The filter validates exactly like prod; only issuance is fake.
3. **No per-route policies.** One global window + one auth rule cover every lab. Route tables grow when a lab needs different treatment, not before.
4. **No Config Server.** Its job (one place for shared values) is currently done by 7 small yml files you can read. Re-add when a value actually changes per environment in a lab.

## Labs
1. **Discovery:** start eureka → 4 services → gateway. Dashboard `:8761` shows 5 registrations. Kill inventory instance → gateway 500s for its paths only; others fine. Restart → traffic resumes, no gateway restart.
2. **Auth edge:** `curl /api/v1/cart` without token → 401. Mint via `/labs/token`, retry with Bearer → routed + `X-User-Id` downstream (check order logs). Forge a token with another secret → 401.
3. **Rate limit:** lower `app.ratelimit.max-requests` to 5, burst 10 parallel analytics POSTs → mix of 200/429 with `Retry-After`. Note: restart gateway mid-burst resets counters (in-memory — the documented ceiling, observed).
4. **Scale:** second inventory on another port, same app name → Eureka round-robins `lb://inventory-service`. Then stop one mid-load → retries land on the survivor.
5. Review question: why does JWT live in the gateway and not in each service? (Answer: one verification point, one secret rotation, services stay token-agnostic — but the tradeoff is trust: any caller bypassing the gateway is unauthenticated. Compose models this by exposing only the gateway.)

## Concepts
Edge auth vs service auth, trust boundary, discovery (register/fetch/heartbeat, self-preservation off by default locally), client-side LB (`lb://`), fixed-window limiting + `Retry-After` backpressure, per-instance vs shared quota.
