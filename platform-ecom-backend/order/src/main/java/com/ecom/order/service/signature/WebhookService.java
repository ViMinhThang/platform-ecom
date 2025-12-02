package com.ecom.order.service.signature;

/**
 * Webhook Service Interface
 */
public interface WebhookService {

    void processWebhook(String providerName, String payload, String signature);
}
