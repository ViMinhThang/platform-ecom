package com.ecom.order.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Sub-Order represents items from a single seller
 * Part of an Order Group
 */
@Entity
@Table(name = "sub_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_order_id")
    private Long id;

    @Column(name = "sub_order_number", unique = true, nullable = false, length = 50)
    private String subOrderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private OrderGroup orderGroup;

    // Seller information
    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "seller_name", nullable = false)
    private String sellerName;

    // Status tracking (independent per seller)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50, nullable = false)
    private SubOrderStatus status;

    @Column(name = "fulfillment_status", length = 50)
    private String fulfillmentStatus;

    // Financial (portion of total for this seller)
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "tax", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "shipping_cost", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @Column(name = "discount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    // Seller-specific tracking
    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "tracking_url", length = 500)
    private String trackingUrl;

    @Column(name = "carrier", length = 100)
    private String carrier;

    @Column(name = "estimated_delivery")
    private LocalDate estimatedDelivery;

    // Timestamps
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // Relationships
    @OneToMany(mappedBy = "subOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubOrderItem> items = new ArrayList<>();

    // Helper methods
    public void addItem(SubOrderItem item) {
        items.add(item);
        item.setSubOrder(this);
    }

    public void removeItem(SubOrderItem item) {
        items.remove(item);
        item.setSubOrder(null);
    }

    /**
     * Calculate total from items
     */
    public void recalculateTotal() {
        this.subtotal = items.stream()
                .map(SubOrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.total = subtotal
                .add(tax)
                .add(shippingCost)
                .subtract(discount);
    }

    /**
     * Update status with timestamp tracking
     */
    public void updateStatus(SubOrderStatus newStatus, Long changedBy, String notes) {
        this.status = newStatus;

        // Update timestamps based on new status
        if (newStatus == SubOrderStatus.SHIPPED && this.shippedAt == null) {
            this.shippedAt = LocalDateTime.now();
        } else if (newStatus == SubOrderStatus.DELIVERED && this.deliveredAt == null) {
            this.deliveredAt = LocalDateTime.now();
        } else if (newStatus == SubOrderStatus.CANCELLED && this.cancelledAt == null) {
            this.cancelledAt = LocalDateTime.now();
        }

        // Update parent order group
        if (orderGroup != null) {
            orderGroup.updateOverallStatus();
        }
    }
}
