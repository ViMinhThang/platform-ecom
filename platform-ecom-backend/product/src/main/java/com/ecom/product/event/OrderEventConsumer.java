package com.ecom.product.event;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.event.OrderCreatedEvent.OrderItemEvent;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductVariant;
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
 * Updates product stock and sales counts when orders are created.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    /**
     * Consumer bean for order created events.
     * Updates variant stock (-quantity) and product totalSold (+quantity).
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
            updateStockAndSales(item);
        }

        log.info("Processed order {} - updated {} items",
                event.getOrderNumber(), event.getItems().size());
    }

    private void updateStockAndSales(OrderItemEvent item) {
        // Update variant stock
        if (item.getVariantId() != null) {
            variantRepository.findById(item.getVariantId()).ifPresent(variant -> {
                int newStock = variant.getStock() - item.getQuantity();
                variant.setStock(Math.max(0, newStock)); // Don't go negative
                variant.setTotalSold(variant.getTotalSold() + item.getQuantity());
                variantRepository.save(variant);

                log.debug("Updated variant {}: stock={}, totalSold={}",
                        variant.getId(), variant.getStock(), variant.getTotalSold());
            });
        }

        // Update product totalSold
        productRepository.findById(item.getProductId()).ifPresent(product -> {
            product.setTotalSold(product.getTotalSold() + item.getQuantity());
            productRepository.save(product);

            log.debug("Updated product {}: totalSold={}",
                    product.getId(), product.getTotalSold());
        });
    }
}
