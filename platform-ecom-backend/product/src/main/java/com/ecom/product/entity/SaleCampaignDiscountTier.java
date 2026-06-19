package com.ecom.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sale_campaign_discount_tiers", indexes = {
        @Index(name = "idx_sale_campaign_tier_campaign", columnList = "sale_campaign_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleCampaignDiscountTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_campaign_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private SaleCampaign saleCampaign;

    @Column(name = "min_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "max_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal maxPrice;

    @Column(name = "discount_percent", nullable = false)
    private Integer discountPercent;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    /**
     * Check if a given price falls within this tier's range
     */
    public boolean matchesPrice(BigDecimal price) {
        return price.compareTo(minPrice) >= 0 && price.compareTo(maxPrice) <= 0;
    }

    /**
     * Calculate the sale price for a given original price
     */
    public BigDecimal calculateSalePrice(BigDecimal originalPrice) {
        // Convert discountPercent (e.g. 15) to a multiplier (e.g. 1 - (15 / 100) = 0.85)
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
                BigDecimal.valueOf(discountPercent).divide(BigDecimal.valueOf(100)));
        
        // Multiply originalPrice by the multiplier and round to 2 decimal places (standard currency format)
        return originalPrice.multiply(discountMultiplier).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
