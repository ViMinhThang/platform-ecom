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
                int reservedStock = event.getReservedStock() != null ? event.getReservedStock() : 0;
                int sellableStock = event.getAvailableStock() != null
                        ? event.getAvailableStock()
                        : Math.max(0, event.getNewStock() - reservedStock);
                variant.setStock(sellableStock);
                variantRepository.save(variant);
                log.debug("Updated variant {} sellable stock to {}", event.getVariantId(), sellableStock);
            });
        } catch (Exception e) {
            log.error("Error syncing stock for variant {}: {}", event.getVariantId(), e.getMessage());
        }
    }
}
