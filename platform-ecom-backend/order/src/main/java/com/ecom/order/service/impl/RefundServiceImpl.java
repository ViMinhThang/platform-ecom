package com.ecom.order.service.impl;

import com.ecom.order.dto.RefundRequest;
import com.ecom.order.entity.PaymentTransaction;
import com.ecom.order.entity.RefundTransaction;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import com.ecom.order.entity.PaymentStatus;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.OrderGroupStatus;
import com.ecom.order.payment.PaymentProvider;
import com.ecom.order.payment.PaymentProviderFactory;
import com.ecom.order.payment.RefundResult;
import com.ecom.order.repository.PaymentTransactionRepository;
import com.ecom.order.repository.RefundTransactionRepository;
import com.ecom.order.repository.SubOrderRepository;
import com.ecom.order.service.signature.RefundService;
import com.ecom.order.repository.OrderGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final RefundTransactionRepository refundTransactionRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final SubOrderRepository subOrderRepository;
    private final OrderGroupRepository orderGroupRepository;
    private final PaymentProviderFactory providerFactory;

    /**
     * Process refund for a sub-order
     */
    @Transactional
    public RefundTransaction processRefund(Long subOrderId, RefundRequest request) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));

        // Validate refund eligibility
        validateRefundEligibility(subOrder);

        // Get original payment transaction from order group
        PaymentTransaction originalTransaction = paymentTransactionRepository
                .findByGroupId(subOrder.getOrderGroup().getId())
                .stream()
                .filter(pt -> pt.getStatus() == PaymentStatus.SUCCEEDED)
                .findFirst()
                .orElseThrow(() -> new PaymentNotFoundException("No successful payment found"));

        // Create refund transaction
        RefundTransaction refund = RefundTransaction.builder()
                .subOrder(subOrder)
                .originalTransaction(originalTransaction)
                .provider(originalTransaction.getProvider())
                .amount(subOrder.getTotal())
                .currency(originalTransaction.getCurrency())
                .status(PaymentStatus.PROCESSING)
                .reason(request.getReason())
                .build();

        refund = refundTransactionRepository.save(refund);

        try {
            // Process refund with payment provider
            PaymentProvider provider = providerFactory.getProvider(originalTransaction.getProvider());
            RefundResult result = provider.refundPayment(
                    originalTransaction.getProviderTransactionId(),
                    subOrder.getTotal());

            if (result.isSuccess()) {
                // Update refund status
                refund.setProviderRefundId(result.getRefundId());
                refund.setStatus(PaymentStatus.SUCCEEDED);
                refund.setCompletedAt(LocalDateTime.now());

                // Update sub-order status
                subOrder.setStatus(SubOrderStatus.REFUNDED);
                subOrderRepository.save(subOrder);

                // Update order group status
                updateOrderGroupRefundStatus(subOrder.getOrderGroup().getId());

                log.info("Refund completed for sub-order {}: {}", subOrderId, result.getRefundId());
            } else {
                refund.setStatus(PaymentStatus.FAILED);
                refund.setErrorMessage(result.getErrorMessage());

                log.error("Refund failed for sub-order {}: {}", subOrderId, result.getErrorMessage());
            }

            return refund;

        } catch (Exception e) {
            refund.setStatus(PaymentStatus.FAILED);
            refund.setErrorMessage(e.getMessage());
            throw e;
        } finally {
            refundTransactionRepository.save(refund);
        }
    }

    /**
     * Validate if sub-order is eligible for refund
     */
    private void validateRefundEligibility(SubOrder subOrder) {
        // Must be delivered
        if (subOrder.getStatus() != SubOrderStatus.DELIVERED) {
            throw new IllegalStateException("Only delivered orders can be refunded");
        }

        // Check if already refunded
        if (subOrder.getStatus() == SubOrderStatus.REFUNDED) {
            throw new IllegalStateException("Order already refunded");
        }

        // Check refund window (e.g., 30 days)
        if (subOrder.getDeliveredAt() != null) {
            long daysSinceDelivery = java.time.temporal.ChronoUnit.DAYS.between(
                    subOrder.getDeliveredAt(), LocalDateTime.now());

            if (daysSinceDelivery > 30) {
                throw new IllegalStateException("Refund window expired (30 days)");
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
                .filter(so -> so.getStatus() == SubOrderStatus.REFUNDED)
                .count();

        if (refundedCount == subOrders.size()) {
            // All sub-orders refunded
            group.setPaymentStatus(PaymentStatus.FULLY_REFUNDED);
            group.setOverallStatus(OrderGroupStatus.FULLY_REFUNDED);
        } else if (refundedCount > 0) {
            // Some sub-orders refunded
            group.setPaymentStatus(PaymentStatus.PARTIALLY_REFUNDED);
            group.setOverallStatus(OrderGroupStatus.PARTIALLY_REFUNDED);
        }

        orderGroupRepository.save(group);

        log.info("Updated order group {} refund status: {}/{} refunded",
                groupId, refundedCount, subOrders.size());
    }
}

class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(String message) {
        super(message);
    }
}
