package com.ecom.order.helper;

import com.ecom.common.exception.PaymentException;
import com.ecom.order.config.OrderConfigurationProperties;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.PaymentStatus;
import com.ecom.order.entity.PaymentTransaction;
import com.ecom.order.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderPaymentHelper {

    private final PaymentTransactionRepository transactionRepository;
    private final OrderConfigurationProperties properties;

    public void verifyPaymentNotDuplicate(String paymentIntentId) {
        if (transactionRepository.existsByProviderTransactionId(paymentIntentId)) {
            log.warn("Order already created for payment: {}", paymentIntentId);
            throw new PaymentException("Đơn hàng đã được tạo cho thanh toán này");
        }
    }

    public void recordPaymentTransaction(OrderGroup group, String paymentIntentId) {
        PaymentTransaction transaction = PaymentTransaction.builder()
                .orderGroup(group)
                .provider(properties.getPaymentProvider())
                .providerTransactionId(paymentIntentId)
                .paymentMethod(properties.getPaymentMethod())
                .amount(group.getTotalAmount())
                .currency(properties.getDefaultCurrency())
                .status(PaymentStatus.SUCCEEDED)
                .idempotencyKey(paymentIntentId)
                .completedAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);
    }
}
