package com.ecom.order.service.impl;

import com.ecom.common.exception.DuplicatePaymentException;
import com.ecom.common.exception.PaymentException;
import com.ecom.order.payment.PaymentIntent;
import com.ecom.order.payment.PaymentProvider;
import com.ecom.order.payment.PaymentProviderFactory;
import com.ecom.order.payment.PaymentRequest;
import com.ecom.order.service.signature.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final String DEFAULT_PROVIDER = "stripe";
    private static final String PAYMENT_SUCCEEDED_STATUS = "succeeded";

    private final PaymentProviderFactory providerFactory;

    // In-memory idempotency cache. In production, use Redis or database.
    private final Map<String, String> idempotencyKeys = new ConcurrentHashMap<>();

    // ==================== Public API ====================

    @Override
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency,
            String description, Long userId, String idempotencyKey) {
        checkIdempotency(idempotencyKey);
        PaymentIntent intent = executePaymentIntent(amount, currency, description, userId);
        trackIdempotencyKey(idempotencyKey, intent.getId());

        log.info("Created payment intent: {} for amount: {} {}", intent.getId(), amount, currency);
        return intent;
    }

    @Override
    public PaymentIntent verifyPaymentSucceeded(String paymentIntentId) {
        PaymentIntent intent = retrievePaymentIntent(paymentIntentId);
        validatePaymentSucceeded(intent, paymentIntentId);

        log.info("Payment verified as succeeded: {}", paymentIntentId);
        return intent;
    }

    // ==================== Private Helpers ====================

    private void checkIdempotency(String idempotencyKey) {
        if (idempotencyKeys.containsKey(idempotencyKey)) {
            log.warn("Duplicate payment request detected: {}", idempotencyKey);
            throw new DuplicatePaymentException("Yêu cầu thanh toán đã được xử lý");
        }
    }

    private void trackIdempotencyKey(String idempotencyKey, String intentId) {
        idempotencyKeys.put(idempotencyKey, intentId);
    }

    private PaymentIntent executePaymentIntent(BigDecimal amount, String currency,
            String description, Long userId) {
        PaymentProvider provider = providerFactory.getProvider(DEFAULT_PROVIDER);

        PaymentRequest request = PaymentRequest.builder()
                .amount(amount)
                .currency(currency)
                .description(description)
                .userId(userId)
                .build();

        try {
            return provider.createPaymentIntent(request);
        } catch (Exception e) {
            log.error("Failed to create payment intent", e);
            throw new PaymentException("Tạo thanh toán thất bại: " + e.getMessage());
        }
    }

    private PaymentIntent retrievePaymentIntent(String paymentIntentId) {
        // TEST MODE: Allow testing without real Stripe payment
        if (paymentIntentId != null && paymentIntentId.startsWith("TEST_")) {
            log.info("Using mock payment intent for testing: {}", paymentIntentId);
            return PaymentIntent.builder()
                    .id(paymentIntentId)
                    .status(PAYMENT_SUCCEEDED_STATUS)
                    .amount(10000L)
                    .currency("USD")
                    .clientSecret("test_secret")
                    .build();
        }

        PaymentProvider provider = providerFactory.getProvider(DEFAULT_PROVIDER);
        PaymentIntent intent = provider.getPaymentIntent(paymentIntentId);

        if (intent == null) {
            throw new PaymentException("Không tìm thấy yêu cầu thanh toán: " + paymentIntentId);
        }
        return intent;
    }

    private void validatePaymentSucceeded(PaymentIntent intent, String paymentIntentId) {
        if (!PAYMENT_SUCCEEDED_STATUS.equals(intent.getStatus())) {
            log.error("Payment not succeeded. Status: {} for intent: {}",
                    intent.getStatus(), paymentIntentId);
            throw new PaymentException("Thanh toán chưa được xác nhận. Trạng thái: " + intent.getStatus());
        }
    }
}
