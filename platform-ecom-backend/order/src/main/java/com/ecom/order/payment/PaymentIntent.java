package com.ecom.order.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payment Intent response from provider
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntent {
    private String id;
    private String clientSecret;
    private String status;
    private Long amount;
    private String currency;
}
