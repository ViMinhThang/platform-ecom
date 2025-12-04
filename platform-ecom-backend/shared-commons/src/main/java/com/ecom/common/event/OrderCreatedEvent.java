package com.ecom.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Kafka event published when an order is created (payment confirmed).
 * Product service consumes this to update stock and sales counts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long orderId;
    private String orderNumber;
    private Long userId;
    private LocalDateTime createdAt;
    private List<OrderItemEvent> items;

    /**
     * Individual item in the order
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemEvent implements Serializable {
        private static final long serialVersionUID = 1L;

        private Long productId;
        private Long variantId;
        private Integer quantity;
        private String productName;
    }
}
