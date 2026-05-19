package com.ecom.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Kafka event published when inventory availableStock hits 0.
 * Order service consumes this to remove cart items for this variant.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutOfStockEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long productId;
    private Long variantId;
    private String sku;
    private LocalDateTime timestamp;
}
