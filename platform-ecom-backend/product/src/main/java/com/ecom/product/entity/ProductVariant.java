package com.ecom.product.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "product_variants")
@SQLDelete(sql = "UPDATE product_variants SET deleted = true WHERE id = ?")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"product","optionValues"})
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
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

    @Column(name = "deleted")
    @Builder.Default
    private Boolean deleted = false;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
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
