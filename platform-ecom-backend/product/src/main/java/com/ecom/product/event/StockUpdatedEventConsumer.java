package com.ecom.product.event;

import com.ecom.common.event.StockUpdatedEvent;
import com.ecom.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

/**
 * Kafka consumer for stock update events from inventory service.
 * Keeps ProductVariant.stock in sync with inventory service.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class StockUpdatedEventConsumer {

    private final ProductVariantRepository variantRepository;

    /**
     * Consumer bean for stock updated events.
     * Syncs ProductVariant.stock with inventory service.
     */
    @Bean
    public Consumer<StockUpdatedEvent> stockUpdated() {
        return this::processStockUpdated;
    }

    private void processStockUpdated(StockUpdatedEvent event) {
        log.info("Received StockUpdatedEvent: variantId={}, {} -> {}",
                event.getVariantId(), event.getPreviousStock(), event.getNewStock());

        try {
            variantRepository.findById(event.getVariantId()).ifPresent(variant -> {
                variant.setStock(event.getNewStock());
                variantRepository.save(variant);
                log.debug("Updated variant {} stock to {}", event.getVariantId(), event.getNewStock());
            });
        } catch (Exception e) {
            log.error("Error syncing stock for variant {}: {}", event.getVariantId(), e.getMessage());
        }
    }
}
