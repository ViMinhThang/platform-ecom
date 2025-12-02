package com.ecom.order.service.signature;

import com.ecom.order.entity.OrderGroup;
import com.ecom.order.payment.PaymentIntent;

/**
 * Payment Service Interface
 */
public interface PaymentService {

    PaymentIntent createPaymentIntent(OrderGroup orderGroup, String providerName, String idempotencyKey);

    void handlePaymentSuccess(String providerTransactionId);

    void handlePaymentFailure(String providerTransactionId, String errorMessage);
}
