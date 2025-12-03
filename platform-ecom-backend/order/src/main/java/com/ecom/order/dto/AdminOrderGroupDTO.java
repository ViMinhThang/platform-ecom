package com.ecom.order.dto;

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
public class AdminOrderGroupDTO {
    private Long id;
    private String groupNumber;

    // User details
    private Long userId;
    private String userEmail;
    private String userName;

    // Financial
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal shippingCost;
    private BigDecimal discountAmount;
    private String currency;

    // Status
    private String paymentStatus;
    private String overallStatus;

    // Addresses
    private AddressDTO shippingAddress;
    private AddressDTO billingAddress;

    private String notes;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Sub-orders with full details
    private List<AdminSubOrderDTO> subOrders;

    // Payment transactions
    private List<PaymentTransactionDTO> paymentTransactions;
}
