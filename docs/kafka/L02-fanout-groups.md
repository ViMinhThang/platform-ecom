# L02 — Intermediate: fan-out, groups, offsets (DONE)

## Kept as staged labs
- `notification`: new `config/OrderCreatedListener` (`group=notification-group`), email from `event.customerEmail` — deleted `config/KafkaConsumerConfig` (Stream `Consumer` bean) + `client/UserServiceClient` + `config/HttpClientConfig` (user-service is deleted).
- `analytics`: new `consumer/OrderCreatedListener` (`group=analytics-group`) → `trackEvent(PURCHASE)`; `service/impl/EventServiceImpl` now `KafkaTemplate.send(user-event-topic, key=userId)` — deleted `StreamBridge` + old `consumer/KafkaEventConsumer`.
- `analytics/config/KafkaTopicConfig`: `order-created(3p)`, `user-event-topic(3p)`, `product-stats-topic(3p, L4 Streams output)`.

## Deleted
- `product/`, `review/`, `promotion/`, `user/`, `chatbot/` modules; `frontend-client/`, `recommendation-service/`, `sentiment-service/`, `tests/`, old docs, logs. Parent `pom.xml` → 5 modules.

## Labs
1. Start order+inventory+notification+analytics, create 1 order → all 3 groups consume same record (different offsets) — watch in Kafka-UI Consumers.
2. Scale inventory to 2 instances → partition rebalance (3 partitions across 2 members).
3. Stop notification, produce 5 orders, restart → it replays from last committed offset (`earliest` only on first start).

## Concepts
Fan-out = 1 topic × N groups; within a group partitions split across members; offset per (group, partition); `notification`/`analytics` lag independently.
