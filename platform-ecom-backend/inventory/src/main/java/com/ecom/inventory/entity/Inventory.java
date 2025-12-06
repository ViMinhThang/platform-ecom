package com.ecom.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Main inventory entity tracking stock levels for product variants.
 */
@Entity
@Table(name = "inventory", indexes = {
        @Index(name = "idx_inventory_variant", columnList = "variant_id", unique = true),
        @Index(name = "idx_inventory_product", columnList = "product_id"),
        @Index(name = "idx_inventory_sku", columnList = "sku")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "variant_id", nullable = false, unique = true)
    private Long variantId;

    @Column(length = 100)
    private String sku;

    @Column(name = "available_stock", nullable = false)
    @Builder.Default
    private Integer availableStock = 0;

    @Column(name = "reserved_stock", nullable = false)
    @Builder.Default
    private Integer reservedStock = 0;

    @Column(name = "total_stock", nullable = false)
    @Builder.Default
    private Integer totalStock = 0;

    @Column(name = "low_stock_threshold")
    @Builder.Default
    private Integer lowStockThreshold = 10;

    @Column(name = "reorder_point")
    @Builder.Default
    private Integer reorderPoint = 5;

    @Column(name = "reorder_quantity")
    @Builder.Default
    private Integer reorderQuantity = 50;

    @Column(name = "track_inventory")
    @Builder.Default
    private Boolean trackInventory = true;

    @Version
    private Long version;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        recalculateAvailableStock();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        recalculateAvailableStock();
    }

    /**
     * Available stock = total stock - reserved stock
     */
    public void recalculateAvailableStock() {
        this.availableStock = Math.max(0, this.totalStock - this.reservedStock);
    }

    /**
     * Check if stock is below threshold
     */
    public boolean isLowStock() {
        return this.availableStock <= this.lowStockThreshold;
    }

    /**
     * Check if requested quantity is available
     */
    public boolean hasAvailableStock(int quantity) {
        return this.availableStock >= quantity;
    }
}
