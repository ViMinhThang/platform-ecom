package com.ecom.order.service.impl;

import com.ecom.common.exception.DuplicatePaymentException;
import com.ecom.common.exception.TransactionNotFoundException;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.PaymentStatus;
import com.ecom.order.entity.PaymentTransaction;
import com.ecom.order.payment.*;
import com.ecom.order.repository.PaymentTransactionRepository;
import com.ecom.order.service.signature.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentProviderFactory providerFactory;
    private final PaymentTransactionRepository transactionRepository;

    /**
     * Create payment intent for order group
     */
    @Transactional
    public PaymentIntent createPaymentIntent(OrderGroup orderGroup, String providerName, String idempotencyKey) {
        // Check idempotency
        if (transactionRepository.existsByIdempotencyKey(idempotencyKey)) {
            log.warn("Duplicate payment request detected: {}", idempotencyKey);
            throw new DuplicatePaymentException("Payment request already processed");
        }

        // Get payment provider
        PaymentProvider provider = providerFactory.getProvider(providerName);

        // Create payment request
        PaymentRequest request = PaymentRequest.builder()
                .orderGroupId(orderGroup.getId())
                .orderNumber(orderGroup.getGroupNumber())
                .amount(orderGroup.getTotalAmount())
                .currency(orderGroup.getCurrency())
                .description("Order " + orderGroup.getGroupNumber())
                .userId(orderGroup.getUserId())
                .build();

        // Create transaction record
        PaymentTransaction transaction = PaymentTransaction.builder()
                .orderGroup(orderGroup)
                .provider(providerName)
                .paymentMethod("card") // Default for now
                .amount(orderGroup.getTotalAmount())
                .currency(orderGroup.getCurrency())
                .status(PaymentStatus.PROCESSING)
                .idempotencyKey(idempotencyKey)
                .build();

        transaction = transactionRepository.save(transaction);

        try {
            // Create payment intent with provider
            PaymentIntent intent = provider.createPaymentIntent(request);

            // Update transaction
            transaction.setProviderTransactionId(intent.getId());
            transaction.setStatus(PaymentStatus.PROCESSING);

            log.info("Created payment intent for order group {}: {}",
                    orderGroup.getGroupNumber(), intent.getId());

            return intent;

        } catch (Exception e) {
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setErrorMessage(e.getMessage());
            throw e;
        } finally {
            transactionRepository.save(transaction);
        }
    }

    /**
     * Handle payment success
     */
    @Transactional
    public void handlePaymentSuccess(String providerTransactionId) {
        try {
            PaymentTransaction transaction = transactionRepository
                    .findByProviderTransactionId(providerTransactionId)
                    .orElseThrow(() -> new TransactionNotFoundException(providerTransactionId));

            if (transaction.getStatus() == PaymentStatus.SUCCEEDED) {
                log.warn("Payment already processed: {}", providerTransactionId);
                return;
            }

            transaction.setStatus(PaymentStatus.SUCCEEDED);
            transaction.setCompletedAt(LocalDateTime.now());
            transactionRepository.save(transaction);

            // Update order group
            OrderGroup group = transaction.getOrderGroup();
            group.setPaymentStatus(PaymentStatus.SUCCEEDED);
            group.updateOverallStatus();

            log.info("Payment succeeded for order group: {}", group.getGroupNumber());
        } catch (TransactionNotFoundException e) {
            log.warn("Transaction not found for payment intent: {}. This may be a race condition.",
                    providerTransactionId);
            // Don't throw - the webhook might arrive before transaction is saved
        }
    }

    /**
     * Handle payment failure
     */
    @Transactional
    public void handlePaymentFailure(String providerTransactionId, String errorMessage) {
        PaymentTransaction transaction = transactionRepository
                .findByProviderTransactionId(providerTransactionId)
                .orElseThrow(() -> new TransactionNotFoundException(providerTransactionId));

        transaction.setStatus(PaymentStatus.FAILED);
        transaction.setErrorMessage(errorMessage);
        transactionRepository.save(transaction);

        // Update order group
        OrderGroup group = transaction.getOrderGroup();
        group.setPaymentStatus(PaymentStatus.FAILED);

        log.error("Payment failed for order group {}: {}",
                group.getGroupNumber(), errorMessage);
    }
}
