package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminSubOrderDTO {
    private Long id;
    private String subOrderNumber;

    // Seller information
    private Long sellerId;
    private String sellerName;
    private String sellerEmail;

    // Status
    private String status;
    private String fulfillmentStatus;

    // Financial
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingCost;
    private BigDecimal discount;
    private BigDecimal total;

    // Tracking
    private String trackingNumber;
    private String trackingUrl;
    private String carrier;
    private LocalDate estimatedDelivery;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;

    // Items
    private List<SubOrderItemDTO> items;

    // Status history
    private List<SubOrderStatusHistoryDTO> statusHistory;
}
