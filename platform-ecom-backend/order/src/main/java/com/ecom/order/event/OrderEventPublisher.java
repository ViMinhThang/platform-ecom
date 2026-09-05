package com.ecom.order.event;

import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.event.OrderCreatedEvent.OrderItemEvent;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.OutboxEvent;
import com.ecom.order.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * L7: no longer touches Kafka. Persists the event to the outbox table in the
 * SAME transaction as the order save (caller is @Transactional), so the two
 * commit atomically. OutboxRelay publishes afterwards.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final OutboxEventRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public void publishOrderCreated(OrderGroup order) {
        try {
            OrderCreatedEvent event = buildOrderCreatedEvent(order);
            outboxRepository.save(OutboxEvent.builder()
                    .topic(KafkaTopics.ORDER_CREATED)
                    .recordKey(String.valueOf(order.getId()))
                    .payload(objectMapper.writeValueAsString(event))
                    .createdAt(LocalDateTime.now())
                    .published(false)
                    .build());
            log.info("Staged OrderCreatedEvent in outbox: orderId={}", order.getId());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to stage OrderCreatedEvent for order " + order.getId(), e);
        }
    }

    private OrderCreatedEvent buildOrderCreatedEvent(OrderGroup order) {
        List<OrderItemEvent> items = order.getSubOrders().stream()
                .flatMap(subOrder -> subOrder.getItems().stream())
                .map(item -> OrderItemEvent.builder()
                        .productId(item.getProductId())
                        .variantId(item.getVariantId())
                        .quantity(item.getQuantity())
                        .productName(item.getProductName())
                        .price(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderCreatedEvent.builder()
                .orderId(order.getId())
                .orderNumber(order.getGroupNumber())
                .userId(order.getUserId())
                .createdAt(LocalDateTime.now())
                .items(items)
                .build();
    }
}
