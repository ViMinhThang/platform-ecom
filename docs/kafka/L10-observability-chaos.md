# L10 — Observability + chaos drills (DONE, runtime verify needs JDK 21)

## What changed
- 5 services (order, inventory, notification, analytics, gateway): + `micrometer-tracing-bridge-otel` + `opentelemetry-exporter-otlp` (BOM-managed, no versions); yml `management.tracing.sampling.probability: 1.0` (lab: trace everything) + `management.otlp.tracing.endpoint` (`${OTLP_ENDPOINT}`, default localhost). No code changes — Boot auto-instruments HTTP, KafkaTemplate, and `@KafkaListener`, and trace context propagates through record headers.
- `notification` + `gateway`: also gained `micrometer-registry-prometheus` (they were the only two without it) and `prometheus` in actuator exposure, so all 6 scrape targets are uniform.
- `observability/` (new): collector config (traces-only pipe: OTLP → Jaeger), `prometheus.yml` (one job per service so `job` splits dashboards; 5s lab interval), Grafana datasource + `saga-learning` dashboard (HTTP RPS, 5xx rate, breaker state, bulkhead availability, Kafka listener avg duration, JVM heap).
- `docker-compose.yml`: `otel-collector`, `jaeger` (`:16686`), `prometheus` (`:9090`), `grafana` (`:3000`, admin/admin). Gateway gets `OTLP_ENDPOINT=http://host.docker.internal:4318/...` + `host-gateway` mapping.

## Deliberate ceilings
1. **Sampling 1.0.** Correct for labs (every trace inspectable), ruinous in prod ( weaknesses: cost, overhead). The yml comment says so.
2. **No Kafka broker metrics.** Consumer lag dashboards need JMX exporters on the broker — real value, but a second pipeline for one panel. The listener-duration panel + Kafka-UI lag view cover the labs.
3. **App metrics bypass the collector.** Prometheus scrapes `/actuator/prometheus` directly; the collector handles traces only. One moving part per signal.
4. **Chaos is doc-only.** No chaos-mesh, no k6 module — `docker stop/kill` + curl + the dashboards are the whole harness (drills below).

## Labs — follow one orderId end to end
1. **Trace the saga:** mint token, create order via gateway. Jaeger `:16686` → find trace by `http.route`: gateway span → order spans (HTTP + outbox tx) → relay's KafkaTemplate send → inventory listener span → mail send span. One trace ID across 4 processes — this is the payoff of the whole path.
2. **Breaker on the dashboard:** SMTP black hole, watch Grafana `Breaker state` flip + 5xx flat (fast-fail, not errors) while Kafka-UI offsets stall.
3. **Chaos drills** (each: hypothesize first, then run, then compare):
   - `docker stop kafka` mid-order → HTTP still 200s (outbox absorbs), relay errors tick, recovery drains. Expect: zero 5xx, lag spike then catch-up.
   - `docker stop postgres` → inventory errors, breaker opens; order/notification unaffected (bulkhead/breaker isolation from L05–L06, now visible).
   - `docker stop inventory` → order-created lag grows, nothing fails visibly except saga rows stuck STARTED (L08 timeout-sweeper exercise, revisited with traces).
   - Scale inventory ×2, kill one mid-load → rebalance in traces (new consumer spans), brief duplicate processing → dedup logs (L03/L07 verified live).
4. Review question: which of the three pillars (logs/metrics/traces) answered each drill fastest, and which question could ONLY traces answer? (Answer: cross-service causality — e.g. "which order's mail is late, and where is it stuck?")

## Concepts
RED (rate/errors/duration) vs USE, trace-as-causality, sampling economics, correlation IDs (`orderNumber` L08 ↔ `traceId` L10: business vs technical correlation), chaos as hypothesis testing, dashboards as living L05–L09 verification.
