package com.ecom.order.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Refund Transaction linked to specific Sub-Order
 */
@Entity
@Table(name = "refund_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_order_id", nullable = false)
    private SubOrder subOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_transaction_id", nullable = false)
    private PaymentTransaction originalTransaction;

    // Provider details
    @Column(name = "provider", length = 50, nullable = false)
    private String provider;

    @Column(name = "provider_refund_id")
    private String providerRefundId;

    // Financial
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", length = 3, nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50, nullable = false)
    private PaymentStatus status;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    // Metadata stored as JSON
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    // Timestamps
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
