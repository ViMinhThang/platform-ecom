# L03 — Intermediate+: saga feedback + reliability (DONE, code; runtime verify pending)

## Loop
`inventory` → `stock-updated-topic` / `low-stock-alert-topic` / `out-of-stock-topic` (key=`variantId`) → `order` consumes `out-of-stock` (`group=order-service`, deletes cart items, manual ack).

## Files
- `inventory/config/KafkaTopicConfig`: owns `stock-updated`, `low-stock-alert`, `out-of-stock` + `order-created-dlt`.
- `order/config/KafkaTopicConfig`: owns `order-created`, `out-of-stock` + `out-of-stock-dlt`.
- `order/event/InventoryEventConsumer`: `@KafkaListener(out-of-stock)` + `@Transactional` + `ack.acknowledge()`, rethrow on failure for retry.
- `init-multi-db.sh`: 7 DBs + pgvector → `orders`, `inventory`, `analytics`.

## Known debt (next lesson trims)
- `order` still has cart/Stripe/promotion/user/product clients — compiles, but order creation calls deleted services at runtime. Next: slim to standalone `Order(id, orderNumber, userId, email, items, status)` or wiremock stubs.
- Retry/DLT: `DefaultErrorHandler` + `DeadLetterPublishingRecoverer` + idempotency table (`processed_order_ids`) not yet added — L03 lab spec is in `README-KAFKA-LABS.md` roadmap; code here is at-least-once + per-item try/catch.

## Verify
Create order with qty > stock → inventory publishes `out-of-stock` → order log `Deleted N cart items` → Kafka-UI shows record in `out-of-stock-topic` partition `hash(variantId)%3`.
