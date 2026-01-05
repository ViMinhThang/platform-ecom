package com.ecom.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;


@Entity
@Table(name = "flash_sale_items", indexes = {
        @Index(name = "idx_flash_sale_item_flash_sale", columnList = "flash_sale_id"),
        @Index(name = "idx_flash_sale_item_variant", columnList = "variant_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_flash_sale_variant", columnNames = {"flash_sale_id", "variant_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flash_sale_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private FlashSale flashSale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProductVariant variant;

    @Column(name = "flash_sale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal flashSalePrice;

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


    public Integer getDiscountPercent() {
        if (variant == null || variant.getPrice() == null || flashSalePrice == null) {
            return 0;
        }
        BigDecimal originalPrice = variant.getPrice();
        if (originalPrice.compareTo(BigDecimal.ZERO) == 0) {
            return 0;
        }
        BigDecimal discount = originalPrice.subtract(flashSalePrice);
        return discount.multiply(BigDecimal.valueOf(100))
                .divide(originalPrice, 0, java.math.RoundingMode.HALF_UP)
                .intValue();
    }


    public boolean incrementSoldCount(int quantity) {
        if (getRemainingStock() < quantity) {
            return false;
        }
        this.soldCount += quantity;
        return true;
    }
}
