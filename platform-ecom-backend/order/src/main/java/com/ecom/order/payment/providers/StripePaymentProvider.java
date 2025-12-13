package com.ecom.order.payment.providers;

import com.ecom.common.exception.PaymentException;
import com.ecom.order.payment.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.param.PaymentIntentCancelParams;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Stripe Payment Provider Implementation
 */
@Slf4j
@Service
public class StripePaymentProvider implements PaymentProvider {

    @Value("${stripe.secret.key:123}")
    private String apiKey;

    @Value("${stripe.enabled:true}")
    private boolean enabled;

    private final PaymentProviderFactory providerFactory;

    public StripePaymentProvider(PaymentProviderFactory providerFactory) {
        this.providerFactory = providerFactory;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
        // Register this provider
        providerFactory.registerProvider("stripe", this);
        log.info("Stripe payment provider initialized and registered");
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentRequest request) {
        try {
            // Convert amount to cents (Stripe uses smallest currency unit)
            long amountInCents = request.getAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(request.getCurrency().toLowerCase())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .setDescription(request.getDescription());

            if (request.getOrderGroupId() != null) {
                paramsBuilder.putMetadata("orderGroupId", request.getOrderGroupId().toString());
            }
            if (request.getOrderNumber() != null) {
                paramsBuilder.putMetadata("orderNumber", request.getOrderNumber());
            }
            if (request.getUserId() != null) {
                paramsBuilder.putMetadata("userId", request.getUserId().toString());
            }

            PaymentIntentCreateParams createParams = paramsBuilder.build();

            com.stripe.model.PaymentIntent stripeIntent = com.stripe.model.PaymentIntent.create(createParams);

            log.info("Created Stripe payment intent: {} for order: {}",
                    stripeIntent.getId(), request.getOrderNumber());

            return mapToPaymentIntent(stripeIntent);

        } catch (StripeException e) {
            log.error("Failed to create Stripe payment intent", e);
            throw new PaymentException("Failed to create payment intent: " + e.getMessage());
        }
    }

    @Override
    public PaymentIntent capturePayment(String transactionId) {
        try {
            com.stripe.model.PaymentIntent intent = com.stripe.model.PaymentIntent.retrieve(transactionId);

            log.info("Retrieved Stripe payment intent: {}", transactionId);
            return mapToPaymentIntent(intent);

        } catch (StripeException e) {
            log.error("Failed to capture payment", e);
            throw new PaymentException("Failed to capture payment: " + e.getMessage());
        }
    }

    @Override
    public boolean cancelPayment(String transactionId) {
        try {
            com.stripe.model.PaymentIntent intent = com.stripe.model.PaymentIntent.retrieve(transactionId);

            PaymentIntentCancelParams params = PaymentIntentCancelParams.builder().build();
            intent.cancel(params);

            log.info("Cancelled Stripe payment intent: {}", transactionId);
            return true;

        } catch (StripeException e) {
            log.error("Failed to cancel payment", e);
            return false;
        }
    }

    @Override
    public PaymentIntent getPaymentIntent(String transactionId) {
        return capturePayment(transactionId);
    }

    @Override
    public String getProviderName() {
        return "stripe";
    }

    @Override
    public boolean isAvailable() {
        return enabled && apiKey != null && !apiKey.isEmpty();
    }

    /**
     * Map Stripe PaymentIntent to our PaymentIntent
     */
    private PaymentIntent mapToPaymentIntent(com.stripe.model.PaymentIntent stripeIntent) {
        return PaymentIntent.builder()
                .id(stripeIntent.getId())
                .clientSecret(stripeIntent.getClientSecret())
                .status(stripeIntent.getStatus())
                .amount(stripeIntent.getAmount())
                .currency(stripeIntent.getCurrency())
                .build();
    }
}
