package com.ecom.order.service.impl;

import com.ecom.common.exception.WebhookSecurityException;
import com.ecom.order.entity.PaymentWebhook;
import com.ecom.order.payment.PaymentProvider;
import com.ecom.order.payment.PaymentProviderFactory;
import com.ecom.order.payment.WebhookEvent;
import com.ecom.order.repository.PaymentWebhookRepository;
import com.ecom.order.service.signature.PaymentService;
import com.ecom.order.service.signature.WebhookService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookServiceImpl implements WebhookService {

    private final PaymentProviderFactory providerFactory;
    private final PaymentWebhookRepository webhookRepository;
    private final PaymentService paymentService;

    /**
     * Process webhook from payment provider
     */
    @Async
    @Transactional
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

        // Check if already processed (idempotency)
        if (webhookRepository.existsByEventId(event.getId())) {
            log.warn("Webhook event already processed: {}", event.getId());
            return;
        }

        // Store webhook for audit trail
        PaymentWebhook webhook = PaymentWebhook.builder()
                .provider(providerName)
                .eventId(event.getId())
                .eventType(event.getType())
                .payload(payload)
                .status("PROCESSING")
                .build();

        webhook = webhookRepository.save(webhook);

        try {
            // Handle the webhook event
            handleWebhookEvent(event);

            // Mark as processed
            webhook.setStatus("PROCESSED");
            webhook.setProcessedAt(LocalDateTime.now());

            log.info("Webhook processed successfully: {}", event.getId());

        } catch (Exception e) {
            // Mark as failed
            webhook.setStatus("FAILED");
            webhook.setRetryCount(webhook.getRetryCount() + 1);

            log.error("Failed to process webhook: {}", event.getId(), e);
            throw e;

        } finally {
            webhookRepository.save(webhook);
        }
    }

    /**
     * Handle different webhook event types
     */
    private void handleWebhookEvent(WebhookEvent event) {
        log.info("Handling webhook event type: {}", event.getType());

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

            case "charge.refunded":
                handleRefund(event);
                break;

            default:
                log.warn("Unhandled webhook event type: {}", event.getType());
        }
    }

    /**
     * Handle payment success
     */
    private void handlePaymentSuccess(WebhookEvent event) {
        String transactionId = extractTransactionId(event);

        log.info("Payment succeeded: {}", transactionId);

        paymentService.handlePaymentSuccess(transactionId);
    }

    /**
     * Handle payment failure
     */
    private void handlePaymentFailed(WebhookEvent event) {
        String transactionId = extractTransactionId(event);
        String errorMessage = extractErrorMessage(event);

        log.error("Payment failed: {} - {}", transactionId, errorMessage);

        paymentService.handlePaymentFailure(transactionId, errorMessage);
    }

    /**
     * Handle payment cancellation
     */
    private void handlePaymentCanceled(WebhookEvent event) {
        String transactionId = extractTransactionId(event);

        log.info("Payment canceled: {}", transactionId);

        paymentService.handlePaymentFailure(transactionId, "Payment canceled by user");
    }

    /**
     * Handle refund
     */
    private void handleRefund(WebhookEvent event) {
        String refundId = extractRefundId(event);

        log.info("Refund completed: {}", refundId);

        // Refund handling is done synchronously in RefundService
        // This webhook is just for confirmation/audit
    }

    /**
     * Extract transaction ID from webhook event data
     */
    private String extractTransactionId(WebhookEvent event) {
        // Implementation depends on provider's event structure
        // For Stripe, it's in event.data.object.id
        if (event.getData() instanceof com.stripe.model.PaymentIntent) {
            com.stripe.model.PaymentIntent pi = (com.stripe.model.PaymentIntent) event.getData();
            return pi.getId();
        }

        // Fallback: try to extract from generic data
        return "unknown";
    }

    /**
     * Extract error message from webhook event
     */
    private String extractErrorMessage(WebhookEvent event) {
        // Implementation depends on provider
        return "Payment failed";
    }

    /**
     * Extract refund ID from webhook event
     */
    private String extractRefundId(WebhookEvent event) {
        // Implementation depends on provider
        return "unknown";
    }
}
