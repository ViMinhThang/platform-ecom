package com.ecom.order.event;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.event.OrderCreatedEvent.OrderItemEvent;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Publishes order events to Kafka
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderEventPublisher {

    private static final String ORDER_CREATED_BINDING = "orderCreated-out-0";

    private final StreamBridge streamBridge;

    /**
     * Publish order created event for stock/sales updates
     */
    public void publishOrderCreated(OrderGroup order) {
        OrderCreatedEvent event = buildOrderCreatedEvent(order);

        boolean sent = streamBridge.send(ORDER_CREATED_BINDING, event);

        if (sent) {
            log.info("Published OrderCreatedEvent: orderId={}, items={}",
                    order.getId(), event.getItems().size());
        } else {
            log.error("Failed to publish OrderCreatedEvent for order: {}", order.getId());
        }
    }

    private OrderCreatedEvent buildOrderCreatedEvent(OrderGroup order) {
        List<OrderItemEvent> items = order.getSubOrders().stream()
                .flatMap(subOrder -> subOrder.getItems().stream())
                .map(this::toOrderItemEvent)
                .collect(Collectors.toList());

        return OrderCreatedEvent.builder()
                .orderId(order.getId())
                .orderNumber(order.getGroupNumber())
                .userId(order.getUserId())
                .createdAt(LocalDateTime.now())
                .items(items)
                .build();
    }

    private OrderItemEvent toOrderItemEvent(SubOrderItem item) {
        return OrderItemEvent.builder()
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .quantity(item.getQuantity())
                .productName(item.getProductName())
                .build();
    }
}
