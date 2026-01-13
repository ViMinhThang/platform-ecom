package com.ecom.promotion.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "voucher_usages", indexes = {
        @Index(name = "idx_voucher_usage_voucher", columnList = "voucher_id"),
        @Index(name = "idx_voucher_usage_user", columnList = "user_id"),
        @Index(name = "idx_voucher_usage_order", columnList = "order_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_voucher_order", columnNames = { "voucher_id", "order_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Voucher voucher;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "used_at", nullable = false)
    private LocalDateTime usedAt;

    @PrePersist
    protected void onCreate() {
        usedAt = LocalDateTime.now();
    }
}
