package com.ecom.order.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "Address ID is required")
    private Long addressId;

    @NotNull(message = "Payment provider is required")
    @Pattern(regexp = "stripe|paypal|square", message = "Invalid payment provider")
    private String paymentProvider;

    private String promoCode;

    @NotNull(message = "Idempotency key is required")
    private String idempotencyKey;
}
