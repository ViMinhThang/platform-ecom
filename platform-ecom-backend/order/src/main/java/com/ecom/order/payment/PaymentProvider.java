package com.ecom.order.payment;

public interface PaymentProvider {

    PaymentIntent createPaymentIntent(PaymentRequest request);

    PaymentIntent capturePayment(String transactionId);

    boolean cancelPayment(String transactionId);

    PaymentIntent getPaymentIntent(String transactionId);

    String getProviderName();

    boolean isAvailable();
}
