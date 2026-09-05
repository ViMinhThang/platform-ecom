package com.ecom.inventory.event;

import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.LowStockAlertEvent;
import com.ecom.common.event.OutOfStockEvent;
import com.ecom.common.event.StockUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * L1: plain producers with keys for ordering (key=variantId).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishStockUpdated(StockUpdatedEvent event) {
        String key = String.valueOf(event.getVariantId());
        kafkaTemplate.send(KafkaTopics.STOCK_UPDATED, key, event).whenComplete((res, ex) -> {
            if (ex != null) {
                log.error("Failed to publish StockUpdatedEvent for variant: {}", event.getVariantId(), ex);
            } else {
                log.info("Published StockUpdatedEvent: variantId={}, {} -> {}",
                        event.getVariantId(), event.getPreviousStock(), event.getNewStock());
            }
        });
    }

    public void publishLowStockAlert(LowStockAlertEvent event) {
        String key = String.valueOf(event.getVariantId());
        kafkaTemplate.send(KafkaTopics.LOW_STOCK_ALERT, key, event).whenComplete((res, ex) -> {
            if (ex != null) {
                log.error("Failed to publish LowStockAlertEvent for variant: {}", event.getVariantId(), ex);
            } else {
                log.info("Published LowStockAlertEvent: variantId={}, stock={}",
                        event.getVariantId(), event.getCurrentStock());
            }
        });
    }

    public void publishOutOfStock(OutOfStockEvent event) {
        String key = String.valueOf(event.getVariantId());
        kafkaTemplate.send(KafkaTopics.OUT_OF_STOCK, key, event).whenComplete((res, ex) -> {
            if (ex != null) {
                log.error("Failed to publish OutOfStockEvent for variant: {}", event.getVariantId(), ex);
            } else {
                log.info("Published OutOfStockEvent: productId={}, variantId={}",
                        event.getProductId(), event.getVariantId());
            }
        });
    }
}
