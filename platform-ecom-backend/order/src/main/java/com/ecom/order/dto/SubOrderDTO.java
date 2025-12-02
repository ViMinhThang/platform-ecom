package com.ecom.order.dto;

import com.ecom.order.entity.SubOrderStatus;
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
public class SubOrderDTO {
    private Long id;
    private String subOrderNumber;
    private Long groupId;

    private Long sellerId;
    private String sellerName;

    private SubOrderStatus status;
    private String fulfillmentStatus;

    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingCost;
    private BigDecimal discount;
    private BigDecimal total;

    private String trackingNumber;
    private String trackingUrl;
    private String carrier;
    private LocalDate estimatedDelivery;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;

    private List<SubOrderItemDTO> items;
}
