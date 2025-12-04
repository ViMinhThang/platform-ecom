package com.ecom.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request DTO for confirming payment after Stripe payment succeeds
 */
@Data
public class ConfirmPaymentRequest {
    @NotBlank(message = "Payment intent ID is required")
    private String paymentIntentId;
    
    @NotNull(message = "Address ID is required")
    private Long addressId;
}
