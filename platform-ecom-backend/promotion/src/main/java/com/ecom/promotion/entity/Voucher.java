package com.ecom.promotion.entity;

import com.ecom.promotion.enums.ApplyMode;
import com.ecom.promotion.enums.VoucherCategory;
import com.ecom.promotion.enums.VoucherStatus;
import com.ecom.promotion.enums.VoucherType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vouchers", indexes = {
        @Index(name = "idx_voucher_code", columnList = "code"),
        @Index(name = "idx_voucher_status", columnList = "status"),
        @Index(name = "idx_voucher_category", columnList = "category"),
        @Index(name = "idx_voucher_apply_mode", columnList = "apply_mode"),
        @Index(name = "idx_voucher_time_range", columnList = "start_time, end_time")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 50)
    private String code; // null for auto-apply vouchers

    @NotBlank
    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VoucherType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VoucherCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "apply_mode", nullable = false, length = 20)
    private ApplyMode applyMode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VoucherStatus status = VoucherStatus.DRAFT;

    @Column(name = "discount_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "min_order_amount", precision = 12, scale = 2)
    private BigDecimal minOrderAmount;

    @Column(name = "max_discount_amount", precision = 12, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "usage_limit_per_user")
    private Integer usageLimitPerUser;

    @Column(name = "current_usage_count")
    @Builder.Default
    private Integer currentUsageCount = 0;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "sale_campaign_id")
    private Long saleCampaignId;

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<VoucherScope> scopes = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isActiveNow() {
        LocalDateTime now = LocalDateTime.now();
        return status == VoucherStatus.ACTIVE
                && now.isAfter(startTime)
                && now.isBefore(endTime);
    }

    public boolean canBeUsed() {
        if (usageLimit == null)
            return true;
        return currentUsageCount < usageLimit;
    }

    public void addScope(VoucherScope scope) {
        scopes.add(scope);
        scope.setVoucher(this);
    }

    public void removeScope(VoucherScope scope) {
        scopes.remove(scope);
        scope.setVoucher(null);
    }

    public BigDecimal calculateDiscount(BigDecimal originalAmount) {
        BigDecimal discount;
        if (type == VoucherType.PERCENTAGE) {
            discount = originalAmount.multiply(discountValue)
                    .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
            if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
                discount = maxDiscountAmount;
            }
        } else {
            discount = discountValue;
        }
        return discount.min(originalAmount);
    }
}
