package com.ecom.promotion.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Historical record of discounts applied to products/variants.
 * Used for chatbot queries like "best discount ever".
 */
@Entity
@Table(name = "product_discount_history", indexes = {
        @Index(name = "idx_discount_history_product", columnList = "product_id"),
        @Index(name = "idx_discount_history_variant", columnList = "variant_id"),
        @Index(name = "idx_discount_history_dates", columnList = "start_time, end_time"),
        @Index(name = "idx_discount_history_percent", columnList = "discount_percent")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDiscountHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "variant_id")
    private Long variantId;

    @Column(name = "voucher_id")
    private Long voucherId;

    @Column(name = "sale_campaign_id")
    private Long saleCampaignId;

    @Column(name = "discount_name", nullable = false, length = 255)
    private String discountName;

    @Column(name = "original_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "discounted_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountedPrice;

    @Column(name = "discount_percent", nullable = false)
    private Integer discountPercent;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        recordedAt = LocalDateTime.now();
    }
}
