# L01 — Beginner: first producer → consumer (DONE)

## Kept
- `shared-commons`: `event/OrderCreatedEvent` (+`customerEmail`), new `event/KafkaTopics` (topic/group catalogue).
- `order`: `event/OrderEventPublisher` now `KafkaTemplate<String,Object>.send(order-created-topic, key=orderId, event)`; `config/KafkaTopicConfig` creates `order-created-topic(3p)`.
- `inventory`: `event/OrderEventConsumer` now `@KafkaListener(order-created-topic, group=inventory-service)` + manual ack; `event/InventoryEventPublisher` sends stock topics with `key=variantId`.
- Local `application.yml` per service (no Config Server): `spring.kafka.bootstrap-servers=localhost:9092`, JSON serdes, `acks=all`, `enable.idempotence=true`, `auto-offset-reset=earliest`.

## Deleted this lesson
- `spring-cloud-stream`, `spring-cloud-stream-binder-kafka`, `spring-cloud-starter-config`, `eureka-client`, `EnableDiscoveryClient`, Zipkin/Brave deps, `configserver/eureka/gateway` modules.

## Why plain spring-kafka
Old `StreamBridge.send("orderCreated-out-0",…)` + `Consumer<>` beans hid topics/partitions/keys behind yml `bindings`. `KafkaTemplate` + `@KafkaListener` expose them — what you need to learn.

## Verify (needs JDK 21 + Maven; not available in this env)
```powershell
docker compose up -d
# terminal 1: run order (:8085), terminal 2: run inventory (:8088)
POST http://localhost:8085/orders  # create order
# Kafka-UI http://localhost:9080 -> order-created-topic -> Messages: key=orderId, 3 partitions
# inventory log: "Received OrderCreatedEvent ... Processed order ..."
```

## Concepts
Producer `acks=all` + idempotence, consumer `auto-offset-reset`, key → partition (`hash(key) % partitions`), manual ack.
