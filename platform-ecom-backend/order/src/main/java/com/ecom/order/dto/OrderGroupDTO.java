package com.ecom.order.dto;

import com.ecom.order.entity.OrderGroupStatus;
import com.ecom.order.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderGroupDTO {
    private Long id;
    private String groupNumber;
    private Long userId;

    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal shippingCost;
    private BigDecimal discountAmount;
    private String currency;

    private PaymentStatus paymentStatus;
    private OrderGroupStatus overallStatus;

    private Long shippingAddressId;
    private Long billingAddressId;

    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<SubOrderDTO> subOrders;

    // Transient field for payment processing
    private String paymentClientSecret;
}
