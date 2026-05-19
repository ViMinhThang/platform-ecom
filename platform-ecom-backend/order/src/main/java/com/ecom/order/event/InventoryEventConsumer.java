package com.ecom.order.event;

import com.ecom.common.event.OutOfStockEvent;
import com.ecom.order.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Consumer;

/**
 * Kafka consumer for inventory events.
 * Listens to OutOfStockEvent to remove affected cart items.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class InventoryEventConsumer {

    private final CartItemRepository cartItemRepository;

    /**
     * Consume OutOfStockEvent and delete cart items for the out-of-stock variant.
     * Binding: outOfStock-in-0
     */
    @Bean
    @Transactional
    public Consumer<OutOfStockEvent> outOfStock() {
        return event -> {
            log.info("Received OutOfStockEvent: productId={}, variantId={}",
                    event.getProductId(), event.getVariantId());

            int deletedCount;
            if (event.getVariantId() != null) {
                deletedCount = cartItemRepository.deleteByProductIdAndVariantId(
                        event.getProductId(), event.getVariantId());
            } else {
                deletedCount = cartItemRepository.deleteByProductId(event.getProductId());
            }

            log.info("Deleted {} cart items for out-of-stock productId={}, variantId={}",
                    deletedCount, event.getProductId(), event.getVariantId());
        };
    }
}
