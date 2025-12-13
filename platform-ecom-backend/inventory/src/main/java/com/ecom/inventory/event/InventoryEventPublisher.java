package com.ecom.inventory.event;

import com.ecom.common.event.LowStockAlertEvent;
import com.ecom.common.event.OutOfStockEvent;
import com.ecom.common.event.StockUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

/**
 * Publishes inventory events to Kafka.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryEventPublisher {

    private static final String STOCK_UPDATED_BINDING = "stockUpdated-out-0";
    private static final String LOW_STOCK_ALERT_BINDING = "lowStockAlert-out-0";
    private static final String OUT_OF_STOCK_BINDING = "outOfStock-out-0";

    private final StreamBridge streamBridge;

    /**
     * Publish stock updated event for product service sync
     */
    public void publishStockUpdated(StockUpdatedEvent event) {
        boolean sent = streamBridge.send(STOCK_UPDATED_BINDING, event);

        if (sent) {
            log.info("Published StockUpdatedEvent: variantId={}, {} -> {}",
                    event.getVariantId(), event.getPreviousStock(), event.getNewStock());
        } else {
            log.error("Failed to publish StockUpdatedEvent for variant: {}", event.getVariantId());
        }
    }

    /**
     * Publish low stock alert for notifications
     */
    public void publishLowStockAlert(LowStockAlertEvent event) {
        boolean sent = streamBridge.send(LOW_STOCK_ALERT_BINDING, event);

        if (sent) {
            log.info("Published LowStockAlertEvent: variantId={}, stock={}",
                    event.getVariantId(), event.getCurrentStock());
        } else {
            log.error("Failed to publish LowStockAlertEvent for variant: {}", event.getVariantId());
        }
    }

    /**
     * Publish out of stock event for order service to clear cart items
     */
    public void publishOutOfStock(OutOfStockEvent event) {
        boolean sent = streamBridge.send(OUT_OF_STOCK_BINDING, event);

        if (sent) {
            log.info("Published OutOfStockEvent: productId={}, variantId={}",
                    event.getProductId(), event.getVariantId());
        } else {
            log.error("Failed to publish OutOfStockEvent for variant: {}", event.getVariantId());
        }
    }
}
