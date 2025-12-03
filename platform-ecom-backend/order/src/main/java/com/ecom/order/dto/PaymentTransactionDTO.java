package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransactionDTO {
    private Long id;
    private String provider;
    private String providerTransactionId;
    private String paymentMethod;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String metadata;
    private String errorCode;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
