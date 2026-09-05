package com.ecom.order.event;

import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.OutOfStockEvent;
import com.ecom.order.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * L3: saga feedback consumer. At-least-once + idempotent delete + manual ack.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryEventConsumer {

    private final CartItemRepository cartItemRepository;

    @KafkaListener(topics = KafkaTopics.OUT_OF_STOCK, groupId = KafkaTopics.GROUP_ORDER)
    @Transactional
    public void onOutOfStock(OutOfStockEvent event, Acknowledgment ack) {
        log.info("Received OutOfStockEvent: productId={}, variantId={}",
                event.getProductId(), event.getVariantId());
        try {
            int deleted;
            if (event.getVariantId() != null) {
                deleted = cartItemRepository.deleteByProductIdAndVariantId(
                        event.getProductId(), event.getVariantId());
            } else {
                deleted = cartItemRepository.deleteByProductId(event.getProductId());
            }
            log.info("Deleted {} cart items for out-of-stock productId={}, variantId={}",
                    deleted, event.getProductId(), event.getVariantId());
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to handle OutOfStockEvent, will retry", e);
            throw e;
        }
    }
}
