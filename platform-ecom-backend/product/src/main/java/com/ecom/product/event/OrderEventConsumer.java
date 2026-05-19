package com.ecom.product.event;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.event.OrderCreatedEvent.OrderItemEvent;

import com.ecom.product.repository.ProductRepository;
import com.ecom.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Consumer;

/**
 * Kafka consumer for order events.
 * Updates product sales counts when orders are created.
 * NOTE: Stock is now managed by inventory-service, this only updates totalSold.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    /**
     * Consumer bean for order created events.
     * Updates product and variant totalSold counts.
     * Stock updates are handled by inventory-service via StockUpdatedEvent.
     */
    @Bean
    public Consumer<OrderCreatedEvent> orderCreated() {
        return this::processOrderCreated;
    }

    @Transactional
    public void processOrderCreated(OrderCreatedEvent event) {
        log.info("Received OrderCreatedEvent: orderId={}, items={}",
                event.getOrderId(), event.getItems().size());

        for (OrderItemEvent item : event.getItems()) {
            updateSalesCount(item);
        }

        log.info("Processed order {} - updated {} items",
                event.getOrderNumber(), event.getItems().size());
    }

    /**
     * Updates only the totalSold counts.
     * Stock management has been moved to inventory-service.
     */
    private void updateSalesCount(OrderItemEvent item) {
        // Update variant totalSold only (stock is managed by inventory service)
        if (item.getVariantId() != null) {
            variantRepository.findById(item.getVariantId()).ifPresent(variant -> {
                variant.setTotalSold(variant.getTotalSold() + item.getQuantity());
                variantRepository.save(variant);
                log.debug("Updated variant {} totalSold={}", variant.getId(), variant.getTotalSold());
            });
        }

        // Update product totalSold
        productRepository.findById(item.getProductId()).ifPresent(product -> {
            product.setTotalSold(product.getTotalSold() + item.getQuantity());
            productRepository.save(product);
            log.debug("Updated product {} totalSold={}", product.getId(), product.getTotalSold());
        });
    }
}
