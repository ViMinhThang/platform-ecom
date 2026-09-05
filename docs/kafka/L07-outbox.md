# L07 — Transactional outbox (DONE, runtime verify needs JDK 21)

## The bug this fixes
`confirmPaymentAndCreateOrder` saved the order, then `OrderEventPublisher` sent straight to Kafka. A crash between the two committed an order with no event — silent loss, invisible until a customer asks where their stock decrement went. DB + broker can't share a transaction, so the fix is: commit the *intent* with the order, deliver it afterwards.

## What changed (`order` only)
- `entity/OutboxEvent` (new): `topic, recordKey, payload(JSON), createdAt, published, publishedAt`, table `outbox_events`.
- `repository/OutboxEventRepository` (new): `findByPublishedFalseOrderByIdAsc(Pageable)` + `deletePublishedBefore` cleanup.
- `event/OrderEventPublisher`: **no longer touches Kafka** — serializes the event and saves one outbox row. Called from the `@Transactional` service method, so order + intent commit atomically. `KafkaTemplate` import deleted.
- `event/OutboxRelay` (new, `@Scheduled` 2s + `@EnableScheduling` on the app): sends unpublished rows, blocking `.get()` per send, marks published only on ack. A failed row stays for the next tick — **the poll is the retry**, no retry library. Published rows older than 7 days are deleted in the same tick.
- `application.yml`: `app.outbox.relay-interval-ms/batch-size` knobs.

## Design decisions (ladder)
1. **Polling relay, not Debezium CDC.** Debezium adds a Connect cluster + connector config for the same guarantee. Polling is ~40 lines you can read; graduate to CDC when poll load shows up in slow-query logs, not before.
2. **One tx per relay tick, documented.** Holding the tx across up to 50 sends keeps row locks longer than ideal; per-row txs would be "more correct" at scale. Crash safety is identical either way (uncommitted marks replay; consumer dedups), so readability wins at lab scale — the tradeoff is named in a code comment.
3. **Blocking `.get()`, not fire-and-forget.** The relay's job is delivery confirmation; async sends with callbacks would reintroduce the exact lost-event window we're closing.
4. **No Kafka transactions (`read_committed`/EOS).** The outbox already gives effectively-once *delivery intent*; EOS adds broker `transactional.id` fencing for a problem this topology doesn't have (single relay, idempotent consumers).

## Idempotency verdict: NO new table
The roadmap promised a `processed_order_ids` table. Building it would duplicate what `InventoryServiceImpl.processOrderCreated` already does: the `existsByInventoryIdAndReferenceTypeAndReferenceId(…, "ORDER", orderNumber)` check **is** the durable processed-set, keyed per (variant, order). A dedicated table only wins when no natural business record exists (e.g. notification mail sends — which instead stay naturally retryable). Rule taught: *idempotency = a durable "seen this" record checked before mutating* — reuse the business table when it qualifies, dedicated table only when it doesn't.

## Labs
1. **Loss window closed:** create order, check `outbox_events` row flips `published` within ~2s; Kafka-UI shows the record. Kill order mid-relay (SIGKILL during a 50-row backlog) → restart replays, inventory logs "Skipping already processed" — no double-decrement.
2. **Relay lag as a metric:** stop Kafka, create 5 orders (HTTP still 200 — outbox absorbs), restart Kafka → all 5 relay within ticks. This decoupling is the point: producers never block on broker health.
3. Review question: why must the publisher NOT be `@Transactional(REQUIRES_NEW)`? (Answer: it must join the caller's tx — its own tx would commit independently and reopen the loss window.)
