# L05 — Timeouts, retries, deadlines (DONE, runtime verify needs JDK 21)

## What changed
- `inventory`: `resilience4j-spring-boot3:2.2.0` + `spring-boot-starter-aop` deps; `@Retry("inventoryDb")` on `InventoryServiceImpl.processOrderCreated`; yml policy: 3 attempts, 500ms exponential backoff, retry `TransientDataAccessException` / `CannotAcquireLockException` / `QueryTimeoutException`, ignore `APIException` / `InsufficientStockException`.
- `notification`: same two deps; `@Retry("mailSend")` on `EmailService.sendOrderConfirmationEmail`; yml policy: 3 attempts, 1s exponential backoff, retry `MailSendException`, ignore `AuthenticationFailedException`. Deadlines via native SMTP timeouts (`connectiontimeout/timeout/writetimeout: 5000`) — no `TimeLimiter`.
- `order`: untouched (its `resilience4j` dep is still unused — kept for L06/L08, noted not removed to avoid churn).

## Why this shape (ladder)
1. **Retry only transient faults.** Business outcomes (`InsufficientStock`, bad quantity, bad SMTP credentials) are deterministic — retrying them burns partitions and SMTP quotas. `ignore-exceptions` encodes that.
2. **Retry is safe here because the work is idempotent.** `processOrderCreated` dedups on `(inventoryId, ORDER, orderNumber)`; a redelivered attempt after a crash is a logged no-op. Retry without idempotency (L03) would double-decrement stock.
3. **No `TimeLimiter`.** It requires `CompletableFuture` return types — refactoring sync mail/DB calls to async just for a timeout is over-engineering. Native deadlines (SMTP props, JDBC `queryTimeout` where needed) cover it.
4. **No retry on the Kafka send path.** Producer already has `acks=all` + `enable.idempotence=true` + broker-side retries (L01). A second retry layer would reorder per-key sends.

## Failure flow to trace
`SMTP down` → `sendEmail` throws `MailSendException` → 3 attempts (1s, 2s) → throws → listener rethrows → container error handler logs, offset NOT committed → redelivery after restart. Same for DB deadlock in inventory.

## Labs
1. Point `SMTP_HOST` at a black hole (`10.255.255.1`): create order → notification log shows 3 attempts ~3s apart, then give-up. Kafka-UI: offset for `notification-group` does not advance past the poison record.
2. Set `SMTP_USERNAME` bogus with a reachable host: exactly 1 attempt (auth ignored by policy). Contrast with lab 1.
3. Review question: why is `@Retry` on the service method and not in the `@KafkaListener`? (Answer: listener is the transaction/ack boundary; retrying inside the service keeps one redelivery = one offset commit decision.)

## Concepts
Retry budgets (attempts × backoff = worst-case added latency per record), exponential backoff + jitter (Resilience4j adds jitter by default — why it matters with 3 partitions rebalancing), retry-only-transient, deadlines at the native layer, idempotency-before-retry ordering.
