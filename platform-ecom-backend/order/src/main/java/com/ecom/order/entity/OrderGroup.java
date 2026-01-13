package com.ecom.order.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order Group represents a single checkout/transaction
 * Contains multiple Sub-Orders (one per seller)
 */
@Entity
@Table(name = "order_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long id;

    @Column(name = "group_number", unique = true, nullable = false, length = 50)
    private String groupNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Overall financial (sum of all sub-orders)
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "shipping_cost", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "applied_product_voucher_id")
    private Long appliedProductVoucherId;

    @Column(name = "applied_shipping_voucher_id")
    private Long appliedShippingVoucherId;

    @Column(name = "currency", length = 3, nullable = false)
    @Builder.Default
    private String currency = "USD";

    // Overall status
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 50, nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_status", length = 50, nullable = false)
    private OrderGroupStatus overallStatus;

    // Address (shared across all sub-orders)
    @Column(name = "shipping_address_id", nullable = false)
    private Long shippingAddressId;

    @Column(name = "billing_address_id")
    private Long billingAddressId;

    // Metadata
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "orderGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubOrder> subOrders = new ArrayList<>();

    @OneToMany(mappedBy = "orderGroup", cascade = CascadeType.ALL)
    @Builder.Default
    private List<PaymentTransaction> paymentTransactions = new ArrayList<>();

    // Helper methods
    public void addSubOrder(SubOrder subOrder) {
        subOrders.add(subOrder);
        subOrder.setOrderGroup(this);
    }

    public void removeSubOrder(SubOrder subOrder) {
        subOrders.remove(subOrder);
        subOrder.setOrderGroup(null);
    }

    public void addPaymentTransaction(PaymentTransaction transaction) {
        paymentTransactions.add(transaction);
        transaction.setOrderGroup(this);
    }

    /**
     * Calculate total from all sub-orders
     */
    public void recalculateTotals() {
        this.totalAmount = subOrders.stream()
                .map(SubOrder::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.taxAmount = subOrders.stream()
                .map(SubOrder::getTax)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.shippingCost = subOrders.stream()
                .map(SubOrder::getShippingCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Update overall status based on sub-order statuses
     */
    public void updateOverallStatus() {
        if (subOrders.isEmpty()) {
            return;
        }

        long deliveredCount = subOrders.stream()
                .filter(so -> so.getStatus() == SubOrderStatus.DELIVERED)
                .count();
        long shippedCount = subOrders.stream()
                .filter(so -> so.getStatus() == SubOrderStatus.SHIPPED)
                .count();
        long refundedCount = subOrders.stream()
                .filter(so -> so.getStatus() == SubOrderStatus.REFUNDED)
                .count();

        if (deliveredCount == subOrders.size()) {
            this.overallStatus = OrderGroupStatus.COMPLETED;
        } else if (refundedCount == subOrders.size()) {
            this.overallStatus = OrderGroupStatus.FULLY_REFUNDED;
            this.paymentStatus = PaymentStatus.FULLY_REFUNDED;
        } else if (refundedCount > 0) {
            this.overallStatus = OrderGroupStatus.PARTIALLY_REFUNDED;
            this.paymentStatus = PaymentStatus.PARTIALLY_REFUNDED;
        } else if (shippedCount > 0) {
            this.overallStatus = OrderGroupStatus.PARTIALLY_SHIPPED;
        } else if (paymentStatus == PaymentStatus.SUCCEEDED) {
            this.overallStatus = OrderGroupStatus.PROCESSING;
        }
    }
}
