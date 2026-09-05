package com.ecom.order.event;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.order.entity.OutboxEvent;
import com.ecom.order.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * L7: polls the outbox and publishes to Kafka. At-least-once by construction:
 * a row is marked published only after the send is acknowledged; a crash
 * before that leaves it for the next poll (consumer dedups on ORDER/orderNumber).
 * Failures are left unpublished for the next tick — no retry library needed,
 * the poll IS the retry.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxRelay {

    private final OutboxEventRepository outboxRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.outbox.relay-batch-size:50}")
    private int batchSize;

    @Scheduled(fixedDelayString = "${app.outbox.relay-interval-ms:2000}")
    @Transactional
    public void relay() {
        // One tx for readability (batch capped at 50). Prod relays mark each
        // row in its own tx to avoid holding locks across Kafka sends; crash
        // safety here comes from at-least-once + consumer dedup either way.
        List<OutboxEvent> pending =
                outboxRepository.findByPublishedFalseOrderByIdAsc(PageRequest.of(0, batchSize));
        for (OutboxEvent row : pending) {
            try {
                OrderCreatedEvent event = objectMapper.readValue(row.getPayload(), OrderCreatedEvent.class);
                kafkaTemplate.send(row.getTopic(), row.getRecordKey(), event).get();
                row.setPublished(true);
                row.setPublishedAt(LocalDateTime.now());
                log.info("Relayed outbox {} -> {} (key={})", row.getId(), row.getTopic(), row.getRecordKey());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Outbox relay interrupted, row {} stays unpublished", row.getId());
                return;
            } catch (Exception e) {
                log.error("Outbox {} failed, stays unpublished for next tick", row.getId(), e);
            }
        }
        int cleaned = outboxRepository.deletePublishedBefore(LocalDateTime.now().minusDays(7));
        if (cleaned > 0) {
            log.info("Outbox cleanup deleted {} published rows", cleaned);
        }
    }
}
