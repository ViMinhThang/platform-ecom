package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for checkout session initiation response
 * Returned when user starts checkout - contains Stripe client secret for payment
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSessionDTO {
    private String clientSecret;
    private String paymentIntentId;
    private BigDecimal amount;
    private String currency;
    private Long addressId;
    private List<CartItemDTO> items;
}
