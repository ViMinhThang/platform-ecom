# Kafka Learning Path — beginner → advanced

Trimmed repo: `order` + `inventory` core saga, `notification` + `analytics` staged fan-out, KRaft + Kafka-UI. No Eureka/Config/Gateway, no frontend/ML.

## Lessons
- [L00](kafka/L00-infra.md) — KRaft single-broker + UI + slim Postgres ✅
- [L01](kafka/L01-beginner-producer-consumer.md) — `KafkaTemplate` + `@KafkaListener`, keys, acks ✅ (runtime verify needs JDK 21)
- [L02](kafka/L02-fanout-groups.md) — 1 topic × 3 groups, rebalance, offsets ✅
- [L03](kafka/L03-saga-feedback.md) — stock feedback loop, at-least-once ✅ (DLT/idempotency table next)
- L04 (planned) — 3-broker `docker-compose.advanced.yml`, Schema Registry/Avro, Streams `product-stats-topic`, exactly-once, Micrometer/Prometheus, EmbeddedKafka tests.

## Run
```powershell
docker compose up -d                      # base: postgres + kafka + kafka-ui
docker compose -f docker-compose.yml -f docker-compose.advanced.yml up -d  # L4 only
# Kafka-UI: http://localhost:9080 (cluster kafka-learning)
# order :8085, inventory :8088, notification :8090, analytics :8091
```

## Prerequisites for full verify
JDK 21 + Maven (`mvnw` in repo is unix-only; Windows env here has JDK 26, no Maven) — run `./mvnw -pl shared-commons,order,inventory,notification,analytics -am package` on a JDK 21 machine.
