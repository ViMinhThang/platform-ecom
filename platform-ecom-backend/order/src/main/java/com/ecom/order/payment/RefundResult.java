package com.ecom.order.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Refund result from payment provider
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundResult {
    private String refundId;
    private String status;
    private BigDecimal amount;
    private String currency;
    private boolean success;
    private String errorMessage;
}
