package com.ecom.inventory.event;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.event.OrderCreatedEvent.OrderItemEvent;
import com.ecom.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

/**
 * Kafka consumer for order events.
 * Decrements stock when orders are confirmed.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final InventoryService inventoryService;

    /**
     * Consumer bean for order created events.
     * Decrements inventory stock for each item in the order.
     */
    @Bean
    public Consumer<OrderCreatedEvent> orderCreated() {
        return this::processOrderCreated;
    }

    private void processOrderCreated(OrderCreatedEvent event) {
        log.info("Received OrderCreatedEvent: orderId={}, orderNumber={}, items={}",
                event.getOrderId(), event.getOrderNumber(), event.getItems().size());

        for (OrderItemEvent item : event.getItems()) {
            try {
                if (item.getVariantId() != null) {
                    inventoryService.processOrderCreated(
                            item.getVariantId(),
                            item.getQuantity(),
                            event.getOrderNumber()
                    );
                }
            } catch (Exception e) {
                log.error("Error processing order item variantId={}: {}",
                        item.getVariantId(), e.getMessage());
            }
        }

        log.info("Processed order {} - updated {} items",
                event.getOrderNumber(), event.getItems().size());
    }
}
