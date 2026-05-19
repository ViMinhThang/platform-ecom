package com.ecom.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sale_campaign_items", indexes = {
        @Index(name = "idx_sale_campaign_item_campaign", columnList = "sale_campaign_id"),
        @Index(name = "idx_sale_campaign_item_variant", columnList = "variant_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_sale_campaign_variant", columnNames = { "sale_campaign_id", "variant_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleCampaignItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_campaign_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private SaleCampaign saleCampaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProductVariant variant;

    @Column(name = "sale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "discount_percent", nullable = false)
    private Integer discountPercent;

    @Column(name = "stock_limit", nullable = false)
    private Integer stockLimit;

    @Column(name = "sold_count")
    @Builder.Default
    private Integer soldCount = 0;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    public Integer getRemainingStock() {
        return Math.max(0, stockLimit - soldCount);
    }

    public boolean isAvailable() {
        return getRemainingStock() > 0;
    }

    public boolean incrementSoldCount(int quantity) {
        if (getRemainingStock() < quantity) {
            return false;
        }
        this.soldCount += quantity;
        return true;
    }
}
