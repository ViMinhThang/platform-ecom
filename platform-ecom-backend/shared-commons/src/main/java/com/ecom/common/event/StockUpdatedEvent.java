package com.ecom.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Kafka event published when inventory stock is updated.
 * Product service consumes this to keep ProductVariant.stock in sync.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockUpdatedEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long variantId;
    private Long productId;
    private Integer previousStock;
    private Integer newStock;
    private Integer availableStock;
    private Integer reservedStock;
    private String transactionType; // SALE, ADJUSTMENT, RESERVATION, RELEASE
    private String reason;
    private Long performedBy;
    private LocalDateTime timestamp;
}
