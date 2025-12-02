package com.ecom.order.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.order.service.signature.WebhookService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Payment Webhook Controller
 * Handles webhooks from payment providers (Stripe, PayPal, etc.)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/webhooks/payments")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final WebhookService webhookService;

    /**
     * Handle Stripe webhooks
     */
    @PostMapping("/stripe")
    public ResponseEntity<APIResponse<String>> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {

        log.info("Received Stripe webhook");

        webhookService.processWebhook("stripe", payload, signature);

        return ResponseBuilder.success("Webhook received", null);
    }

    /**
     * Handle PayPal webhooks (future implementation)
     */
    @PostMapping("/paypal")
    public ResponseEntity<APIResponse<String>> handlePayPalWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "PayPal-Transmission-Sig", required = false) String signature) {

        log.info("Received PayPal webhook");

        webhookService.processWebhook("paypal", payload, signature);

        return ResponseBuilder.success("Webhook received", null);
    }

    /**
     * Generic webhook handler for any provider
     */
    @PostMapping("/{provider}")
    public ResponseEntity<APIResponse<String>> handleWebhook(
            @PathVariable String provider,
            @RequestBody String payload,
            @RequestHeader(value = "X-Signature", required = false) String signature) {

        log.info("Received {} webhook", provider);

        webhookService.processWebhook(provider, payload, signature);

        return ResponseBuilder.success("Webhook received", null);
    }
}
