package com.ecom.order.service.signature;

import com.ecom.order.payment.PaymentIntent;

import java.math.BigDecimal;

/**
 * Payment Service Interface
 * Handles Stripe payment intent creation and verification
 */
public interface PaymentService {

    /**
     * Create a payment intent for checkout (no order created yet)
     */
    PaymentIntent createPaymentIntent(BigDecimal amount, String currency, String description, 
                                       Long userId, String idempotencyKey);

    /**
     * Verify that a payment succeeded with Stripe
     * Returns the payment intent if succeeded, throws exception if not
     */
    PaymentIntent verifyPaymentSucceeded(String paymentIntentId);
}
