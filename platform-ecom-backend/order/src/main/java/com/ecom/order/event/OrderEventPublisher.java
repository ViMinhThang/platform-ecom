package com.ecom.order.event;

import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.event.OrderCreatedEvent.OrderItemEvent;
import com.ecom.order.entity.OrderGroup;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * L1: plain spring-kafka producer. Key=orderId preserves per-order ordering.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreated(OrderGroup order) {
        OrderCreatedEvent event = buildOrderCreatedEvent(order);
        String key = String.valueOf(order.getId());
        kafkaTemplate.send(KafkaTopics.ORDER_CREATED, key, event).whenComplete((res, ex) -> {
            if (ex != null) {
                log.error("Failed to publish OrderCreatedEvent for order: {}", order.getId(), ex);
            } else {
                log.info("Published OrderCreatedEvent: orderId={}, partition={}, offset={}",
                        order.getId(),
                        res.getRecordMetadata().partition(),
                        res.getRecordMetadata().offset());
            }
        });
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
