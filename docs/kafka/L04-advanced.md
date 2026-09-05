# L04 — Advanced: multi-broker, Schema Registry, Streams, exactly-once (SCAFFOLD)

## Infra
- `docker-compose.advanced.yml`: `kafka-2`, `kafka-3` (same `CLUSTER_ID`, quorum `1@kafka:29093,2@kafka-2:29093,3@kafka-3:29093`), `schema-registry:8081`.
- Recreate topics with `RF=3, minISR=2` before running L4:
```powershell
docker compose -f docker-compose.yml -f docker-compose.advanced.yml up -d
```

## Code scaffold
- `analytics`: `kafka-streams` dep + `config/StreamsConfig` (`analytics-streams` app): `USER_EVENT → filter PURCHASE → groupBy productId → 5m tumbling count → PRODUCT_STATS`.
- `KafkaTopicConfig`: `product-stats-topic(3p)` already created by analytics.

## Labs (do on JDK 21 machine)
1. Switch producer `acks=all`, `enable.idempotence=true` (already set) → kill leader, produce still succeeds.
2. Enable `spring.kafka.streams.auto-startup=true`, POST batch events → `product-stats-topic` gets `productId@windowStart → count`.
3. Schema evolution: register `OrderCreatedEvent v1/v2` (add `customerEmail` was v2 — already done) in Registry `:8081`, set `FULL_TRANSITIVE` compatibility.
4. Exactly-once: set producer `transaction-id-prefix` + Streams `processing.guarantee=exactly_once_v2`, replay and show no double-count.
5. Observability: `/actuator/prometheus` per service → Prometheus/Grafana; consumer lag in Kafka-UI.

## Next trims (not yet done)
- `order`: remove Stripe/promotion/user/product clients → standalone order create for clean lab.
- Add `DefaultErrorHandler` + DLT recoverer + `processed_order_ids` idempotency table (L03 debt).
- `spring-kafka-test` EmbeddedKafka tests per service.
