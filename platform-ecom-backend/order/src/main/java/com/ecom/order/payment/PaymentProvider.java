package com.ecom.order.payment;

import java.math.BigDecimal;

/**
 * Payment Provider Interface - Strategy Pattern
 * Implementations: Stripe, PayPal, Square, etc.
 */
public interface PaymentProvider {

    /**
     * Create a payment intent
     */
    PaymentIntent createPaymentIntent(PaymentRequest request);

    /**
     * Capture/confirm a payment
     */
    PaymentIntent capturePayment(String transactionId);

    /**
     * Refund a payment
     */
    RefundResult refundPayment(String transactionId, BigDecimal amount);

    /**
     * Cancel a payment intent
     */
    boolean cancelPayment(String transactionId);

    /**
     * Get payment intent by ID
     */
    PaymentIntent getPaymentIntent(String transactionId);

    /**
     * Verify webhook signature
     */
    boolean verifyWebhookSignature(String payload, String signature);

    /**
     * Parse webhook payload
     */
    WebhookEvent parseWebhookPayload(String payload);

    /**
     * Get provider name
     */
    String getProviderName();

    /**
     * Check if provider is available
     */
    boolean isAvailable();
}
