package com.ecom.inventory.event;

import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.event.OrderCreatedEvent.OrderItemEvent;
import com.ecom.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

/**
 * L2-L3: at-least-once consumer. Business method stays idempotent;
 * per-item try/catch keeps poison items from blocking the partition.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final InventoryService inventoryService;

    @KafkaListener(topics = KafkaTopics.ORDER_CREATED, groupId = KafkaTopics.GROUP_INVENTORY)
    public void onOrderCreated(OrderCreatedEvent event, Acknowledgment ack) {
        log.info("Received OrderCreatedEvent: orderId={}, orderNumber={}, items={}",
                event.getOrderId(), event.getOrderNumber(), event.getItems().size());

        for (OrderItemEvent item : event.getItems()) {
            try {
                if (item.getVariantId() != null) {
                    inventoryService.processOrderCreated(
                            item.getVariantId(),
                            item.getQuantity(),
                            event.getOrderNumber());
                }
            } catch (Exception e) {
                log.error("Error processing order item variantId={}: {}",
                        item.getVariantId(), e.getMessage());
            }
        }

        log.info("Processed order {} - updated {} items", event.getOrderNumber(), event.getItems().size());
        ack.acknowledge();
    }
}
