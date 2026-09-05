# L00 — Infra: KRaft, Postgres, Kafka-UI (DONE)

## What changed
- `docker-compose.yml`: removed `redis`, `pgadmin`, `rabbitmq`, `zipkin`, `eureka`, `zookeeper` + `confluentinc/cp-kafka:7.5.0`.
- New: `postgres:17-alpine` (DBs: `orders`, `inventory`, `analytics`), `apache/kafka:3.9.0` KRaft combined mode (no Zookeeper), `provectuslabs/kafka-ui` on `http://localhost:9080`.
- `init-multi-db.sh`: 7 DBs + `pgvector` → 3 DBs for the 4 kept services.
- `docker-compose.advanced.yml`: L4 overlay — 3-broker KRaft (`RF=3`), Schema Registry `:8081`.

## Why
Old stack hid Kafka behind 8 infra services. Learning needs 1 broker + UI. KRaft is the current standard (Zookeeper removed in Kafka 4.0).

## Verify
```powershell
docker compose up -d
docker compose ps
# UI: http://localhost:9080 -> cluster kafka-learning -> Topics
docker compose logs kafka --tail 50
```

Expected: `Kafka Server started`, UI lists cluster `kafka-learning`, no `__consumer_offsets` errors.

## Key concepts
- KRaft combined mode: `KAFKA_PROCESS_ROLES=broker,controller`, `CLUSTER_ID` fixed, `CONTROLLER_QUORUM_VOTERS`.
- Listeners: `PLAINTEXT://kafka:29092` (in-docker) vs `PLAINTEXT_HOST://localhost:9092` (host). Spring uses `localhost:9092`.
- `KAFKA_NUM_PARTITIONS=3` default for auto-created topics; real topics created via `NewTopic` beans later.
