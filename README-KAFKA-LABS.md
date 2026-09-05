# Distributed Systems Learning Path — beginner → advanced

Trimmed repo: `order` + `inventory` core saga, `notification` + `analytics` staged fan-out, KRaft + Kafka-UI. No Eureka/Config/Gateway yet (L09), no frontend/ML.

## Lessons
- [L00](kafka/L00-infra.md) — KRaft single-broker + UI + slim Postgres ✅
- [L01](kafka/L01-beginner-producer-consumer.md) — `KafkaTemplate` + `@KafkaListener`, keys, acks ✅ (runtime verify needs JDK 21)
- [L02](kafka/L02-fanout-groups.md) — 1 topic × 3 groups, rebalance, offsets ✅
- [L03](kafka/L03-saga-feedback.md) — stock feedback loop, at-least-once ✅ (DLT handler still open)
- [L04](kafka/L04-advanced.md) — 3-broker overlay, Schema Registry, Streams scaffold ✅ (runtime verify needs JDK 21)
- [L05](kafka/L05-timeouts-retries.md) — Resilience4j retries, native deadlines ✅ (runtime verify needs JDK 21)
- [L06](kafka/L06-breakers-bulkheads.md) — breaker on mail, bulkhead on analytics ✅ (runtime verify needs JDK 21)
- [L07](kafka/L07-outbox.md) — transactional outbox in order, no new idempotency table (existing dedup qualifies) ✅ (runtime verify needs JDK 21)
- L08 (next) — saga orchestration alongside choreography.
- L08 — saga orchestration alongside choreography.
- L09 — slim gateway (routing + rate limit + JWT) + Eureka. JWT is gateway-validated, `X-User-Id` forwarded; token mint is lab scaffolding, `user/` stays deleted.
- L10 — OpenTelemetry traces, Grafana dashboards, chaos drills.

## Run
```powershell
docker compose up -d                      # base: postgres + kafka + kafka-ui
docker compose -f docker-compose.yml -f docker-compose.advanced.yml up -d  # L4 only
# Kafka-UI: http://localhost:9080 (cluster kafka-learning)
# order :8085, inventory :8088, notification :8090, analytics :8091
```

## Prerequisites for full verify
JDK 21 + Maven (`mvnw` in repo is unix-only; Windows env here has JDK 26, no Maven) — run `./mvnw -pl shared-commons,order,inventory,notification,analytics -am package` on a JDK 21 machine.
