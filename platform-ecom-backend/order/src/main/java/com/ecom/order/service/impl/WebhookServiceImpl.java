package com.ecom.order.service.impl;

import com.ecom.common.exception.WebhookSecurityException;
import com.ecom.order.payment.PaymentProvider;
import com.ecom.order.payment.PaymentProviderFactory;
import com.ecom.order.payment.WebhookEvent;
import com.ecom.order.service.signature.PaymentService;
import com.ecom.order.service.signature.WebhookService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Simplified Webhook Service - processes webhooks without storing them.
 * For audit trail, rely on payment provider's dashboard (e.g., Stripe
 * Dashboard).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookServiceImpl implements WebhookService {

    private final PaymentProviderFactory providerFactory;
    private final PaymentService paymentService;

    /**
     * Process webhook from payment provider
     */
    public void processWebhook(String providerName, String payload, String signature) {
        log.info("Processing {} webhook", providerName);

        // Get provider
        PaymentProvider provider = providerFactory.getProvider(providerName);

        // Verify signature (CRITICAL for security)
        if (signature != null && !provider.verifyWebhookSignature(payload, signature)) {
            log.error("Invalid webhook signature from {}", providerName);
            throw new WebhookSecurityException("Invalid webhook signature");
        }

        // Parse webhook event
        WebhookEvent event = provider.parseWebhookPayload(payload);

        // Handle the webhook event
        handleWebhookEvent(event);

        log.info("Webhook processed: {} - {}", event.getId(), event.getType());
    }

    /**
     * Handle different webhook event types
     */
    private void handleWebhookEvent(WebhookEvent event) {
        switch (event.getType()) {
            case "payment_intent.succeeded":
                handlePaymentSuccess(event);
                break;

            case "payment_intent.payment_failed":
                handlePaymentFailed(event);
                break;

            case "payment_intent.canceled":
                handlePaymentCanceled(event);
                break;

            // Events we acknowledge but don't need to process
            case "payment_intent.created":
            case "charge.succeeded":
            case "charge.updated":
            case "charge.refunded":
            case "payment_intent.processing":
                log.debug("Acknowledged event (no action): {}", event.getType());
                break;

            default:
                log.warn("Unhandled webhook event type: {}", event.getType());
        }
    }

    private void handlePaymentSuccess(WebhookEvent event) {
        String transactionId = extractTransactionId(event);
        log.info("Payment succeeded: {}", transactionId);
        paymentService.handlePaymentSuccess(transactionId);
    }

    private void handlePaymentFailed(WebhookEvent event) {
        String transactionId = extractTransactionId(event);
        log.error("Payment failed: {}", transactionId);
        paymentService.handlePaymentFailure(transactionId, "Payment failed");
    }

    private void handlePaymentCanceled(WebhookEvent event) {
        String transactionId = extractTransactionId(event);
        log.info("Payment canceled: {}", transactionId);
        paymentService.handlePaymentFailure(transactionId, "Payment canceled");
    }

    private String extractTransactionId(WebhookEvent event) {
        if (event.getData() instanceof com.stripe.model.PaymentIntent pi) {
            return pi.getId();
        }
        return "unknown";
    }
}
