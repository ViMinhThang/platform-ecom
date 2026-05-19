package com.ecom.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ConfirmPaymentRequest {
    @NotBlank(message = "Payment intent ID is required")
    private String paymentIntentId;

    @NotNull(message = "Address ID is required")
    private Long addressId;

    @NotNull(message = "Shipping fee is required")
    private BigDecimal shippingFee;

    private String voucherCode;
}
