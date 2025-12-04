package com.ecom.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Product product;

    @Column(unique = true, nullable = false, length = 100)
    private String sku;

    private String imageUrl;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "sale_price")
    private BigDecimal salePrice;

    @Column(name = "sale_start")
    private LocalDateTime saleStart;

    @Column(name = "sale_end")
    private LocalDateTime saleEnd;
    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "total_sold")
    private Integer totalSold = 0;

    @Column(name = "hidden")
    @Builder.Default
    private Boolean hidden = false;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<VariantOptionValue> optionValues = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    public BigDecimal getEffectivePrice() {
        LocalDateTime now = LocalDateTime.now();
        if (salePrice != null &&
                (saleStart == null || now.isAfter(saleStart)) &&
                (saleEnd == null || now.isBefore(saleEnd))) {
            return salePrice;
        }
        return price;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
