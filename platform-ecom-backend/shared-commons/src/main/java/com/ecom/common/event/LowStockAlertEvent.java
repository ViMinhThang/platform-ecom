package com.ecom.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Kafka event published when stock falls below the low stock threshold.
 * Notification service can consume this to alert admins/sellers.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockAlertEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long variantId;
    private Long productId;
    private String sku;
    private String productName;
    private Integer currentStock;
    private Integer threshold;
    private Long sellerId;
    private LocalDateTime timestamp;
}
