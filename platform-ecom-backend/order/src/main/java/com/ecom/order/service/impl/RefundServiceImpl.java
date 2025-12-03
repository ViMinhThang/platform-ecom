package com.ecom.order.service.impl;

import com.ecom.common.exception.OrderGroupNotFoundException;
import com.ecom.common.exception.PaymentNotFoundException;
import com.ecom.common.exception.SubOrderNotFoundException;
import com.ecom.order.dto.RefundRequest;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.OrderGroupStatus;
import com.ecom.order.entity.PaymentStatus;
import com.ecom.order.entity.PaymentTransaction;
import com.ecom.order.entity.RefundTransaction;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import com.ecom.order.payment.PaymentProvider;
import com.ecom.order.payment.PaymentProviderFactory;
import com.ecom.order.payment.RefundResult;
import com.ecom.order.repository.OrderGroupRepository;
import com.ecom.order.repository.PaymentTransactionRepository;
import com.ecom.order.repository.RefundTransactionRepository;
import com.ecom.order.repository.SubOrderRepository;
import com.ecom.order.service.signature.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private static final int REFUND_WINDOW_DAYS = 30;

    private final RefundTransactionRepository refundTransactionRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final SubOrderRepository subOrderRepository;
    private final OrderGroupRepository orderGroupRepository;
    private final PaymentProviderFactory providerFactory;

    /**
     * Process refund for a sub-order
     */
    @Override
    @Transactional
    public RefundTransaction processRefund(Long subOrderId, RefundRequest request) {
        log.info("Processing refund for sub-order: {}", subOrderId);

        SubOrder subOrder = fetchSubOrder(subOrderId);
        validateRefundEligibility(subOrder);

        PaymentTransaction originalTransaction = fetchOriginalTransaction(subOrder.getOrderGroup());
        RefundTransaction refund = createInitialRefundTransaction(subOrder, originalTransaction, request);

        try {
            RefundResult result = executeRefund(originalTransaction, subOrder.getTotal());

            if (result.isSuccess()) {
                handleRefundSuccess(refund, subOrder, result);
            } else {
                handleRefundFailure(refund, result.getErrorMessage());
            }

            return refund;

        } catch (Exception e) {
            handleRefundFailure(refund, e.getMessage());
            throw e;
        } finally {
            refundTransactionRepository.save(refund);
        }
    }

    private SubOrder fetchSubOrder(Long subOrderId) {
        return subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));
    }

    private PaymentTransaction fetchOriginalTransaction(OrderGroup orderGroup) {
        return paymentTransactionRepository.findByGroupId(orderGroup.getId())
                .stream()
                .filter(transaction -> transaction.getStatus() == PaymentStatus.SUCCEEDED)
                .findFirst()
                .orElseThrow(() -> new PaymentNotFoundException(
                        "No successful payment found for order group: " + orderGroup.getId()));
    }

    private RefundTransaction createInitialRefundTransaction(SubOrder subOrder, PaymentTransaction originalTransaction,
            RefundRequest request) {
        RefundTransaction refund = RefundTransaction.builder()
                .subOrder(subOrder)
                .originalTransaction(originalTransaction)
                .provider(originalTransaction.getProvider())
                .amount(subOrder.getTotal())
                .currency(originalTransaction.getCurrency())
                .status(PaymentStatus.PROCESSING)
                .reason(request.getReason())
                .build();
        return refundTransactionRepository.save(refund);
    }

    private RefundResult executeRefund(PaymentTransaction originalTransaction, BigDecimal amount) {
        PaymentProvider provider = providerFactory.getProvider(originalTransaction.getProvider());
        return provider.refundPayment(originalTransaction.getProviderTransactionId(), amount);
    }

    private void handleRefundSuccess(RefundTransaction refund, SubOrder subOrder, RefundResult result) {
        refund.setProviderRefundId(result.getRefundId());
        refund.setStatus(PaymentStatus.SUCCEEDED);
        refund.setCompletedAt(LocalDateTime.now());

        subOrder.setStatus(SubOrderStatus.REFUNDED);
        subOrderRepository.save(subOrder);

        updateOrderGroupRefundStatus(subOrder.getOrderGroup().getId());
        log.info("Refund completed successfully for sub-order {}. Refund ID: {}", subOrder.getId(),
                result.getRefundId());
    }

    private void handleRefundFailure(RefundTransaction refund, String errorMessage) {
        refund.setStatus(PaymentStatus.FAILED);
        refund.setErrorMessage(errorMessage);
        log.error("Refund failed for sub-order {}: {}", refund.getSubOrder().getId(), errorMessage);
    }

    /**
     * Validate if sub-order is eligible for refund
     */
    private void validateRefundEligibility(SubOrder subOrder) {
        if (subOrder.getStatus() != SubOrderStatus.DELIVERED) {
            throw new IllegalStateException(
                    "Only delivered orders can be refunded. Current status: " + subOrder.getStatus());
        }

        if (subOrder.getStatus() == SubOrderStatus.REFUNDED) {
            throw new IllegalStateException("Order is already refunded");
        }

        if (subOrder.getDeliveredAt() != null) {
            long daysSinceDelivery = ChronoUnit.DAYS.between(subOrder.getDeliveredAt(), LocalDateTime.now());
            if (daysSinceDelivery > REFUND_WINDOW_DAYS) {
                throw new IllegalStateException("Refund window expired (" + REFUND_WINDOW_DAYS + " days)");
            }
        }
    }

    /**
     * Update order group refund status based on sub-orders
     */
    private void updateOrderGroupRefundStatus(Long groupId) {
        OrderGroup group = orderGroupRepository.findById(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));

        List<SubOrder> subOrders = group.getSubOrders();
        long refundedCount = subOrders.stream()
                .filter(subOrder -> subOrder.getStatus() == SubOrderStatus.REFUNDED)
                .count();

        if (refundedCount == subOrders.size()) {
            group.setPaymentStatus(PaymentStatus.FULLY_REFUNDED);
            group.setOverallStatus(OrderGroupStatus.FULLY_REFUNDED);
        } else if (refundedCount > 0) {
            group.setPaymentStatus(PaymentStatus.PARTIALLY_REFUNDED);
            group.setOverallStatus(OrderGroupStatus.PARTIALLY_REFUNDED);
        }

        orderGroupRepository.save(group);
        log.info("Updated order group {} refund status. {}/{} sub-orders refunded.", groupId, refundedCount,
                subOrders.size());
    }
}
