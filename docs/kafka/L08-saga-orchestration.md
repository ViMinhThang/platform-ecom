# L08 — Saga orchestration alongside choreography (DONE, runtime verify needs JDK 21)

## Why this lesson exists
L03's choreography works but its state lives nowhere: ask "where is order ORD-42?" and the answer is spread across three services' logs. The orchestrator writes it down (`order_sagas` table) and performs compensation explicitly. Both patterns now run side by side on the same topics so you can compare them live.

## What changed
- `shared-commons`: nullable `orderNumber` on `StockUpdatedEvent` + `OutOfStockEvent`. Null = ambient (adjustments, post-sale depletion broadcasts); set = saga-correlated.
- `inventory`: `publishStockUpdatedEvent` overload carrying `orderNumber`, used only by `processOrderCreated`; new `publishOrderFailedEvent` emitting `OutOfStockEvent(orderNumber)` on the `InsufficientStockException` path. Ambient `checkAndAlert` untouched (stays order-free, cart-cleanup consumer unaffected).
- `order/saga/` (new package, no new service, **no new topics**):
  - `SagaStatus` (STARTED/STOCK_CONFIRMED/DONE/FAILED), `SagaState` entity (`orderId` PK, `orderNumber`, expected/confirmed counts), `SagaStateRepository`.
  - `OrderSagaOrchestrator`: `@KafkaListener`s on `stock-updated` + `out-of-stock` in new group `order-saga` (own offsets — `KafkaTopics.GROUP_ORDER_SAGA`). SALE events with orderNumber advance confirmations → DONE; failure events → FAILED + compensation (`overallStatus=CANCELLED`).
  - `OrderEventPublisher` seeds STARTED (+ expected line count) in the same tx as order + outbox.
- Choreography untouched: cart cleanup, notification, analytics keep working exactly as before.

## The two hard-won decisions
1. **Failure needs its own signal.** Zero-stock fires on *successful* sales too (last unit sold), so `orderNumber`-carrying out-of-stock can't mean failure by itself — and cross-topic ordering (stock-updated vs out-of-stock are different topics) can't save you. Hence the explicit `publishOrderFailedEvent` on the insufficient-stock path only. Lesson: broadcast alerts ≠ saga signals; conflating them cancels valid orders.
2. **Orchestrator never shares a consumer group.** Same topics, `order-saga` group → independent offsets. Sharing `order-service` would partition-steal from cart cleanup and couple their lag.

## Known limits (by design)
- One event per order line assumed (distinct variants); same variant on two lines over-counts → early DONE. Documented, not fixed — fixing needs line IDs in events.
- Compensation is local (CANCEL status). Cross-service compensation (refund, stock release) = new events, deferred.
- No saga timeout sweep: a saga stuck in STOCK_CONFIRMED (lost event) sits forever. **Lab exercise:** `@Scheduled` sweeper marking stale STARTED/CONFIRMED sagas FAILED after N minutes.

## Labs
1. Happy path: order 2 distinct variants → `order_sagas` row walks STARTED → STOCK_CONFIRMED → DONE; compare with inventory/notification logs (choreography view of the same order).
2. Failure path: order qty > stock → `OutOfStockEvent(orderNumber)` → FAILED + order CANCELLED; cart-cleanup consumer fires on the same record (watch both groups advance in Kafka-UI).
3. Ambient check: manual stock adjustment to zero → out-of-stock with null orderNumber → orchestrator acks untouched, no saga row changes.

## Concepts
Choreography (dumb pipes, smart endpoints) vs orchestration (visible state machine, central compensation), correlation IDs, signal-vs-broadcast discipline, consumer-group independence, compensation locality.
