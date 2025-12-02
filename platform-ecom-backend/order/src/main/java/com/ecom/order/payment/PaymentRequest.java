package com.ecom.order.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Payment request for creating payment intent
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long orderGroupId;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;
    private String description;
    private Long userId;
    private String customerEmail;
}
