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
        normalizeDefaults();
        validateSettings();
        validateStockLevels();
        this.availableStock = Boolean.TRUE.equals(this.trackInventory)
                ? this.totalStock - this.reservedStock
                : this.totalStock;
    }

    /**
     * Check if stock is below threshold
     */
    public boolean isLowStock() {
        return Boolean.TRUE.equals(this.trackInventory)
                && this.availableStock <= this.lowStockThreshold;
    }

    /**
     * Check if requested quantity is available
     */
    public boolean hasAvailableStock(int quantity) {
        if (quantity <= 0) {
            return true;
        }
        return !Boolean.TRUE.equals(this.trackInventory) || this.availableStock >= quantity;
    }

    private void normalizeDefaults() {
        if (this.totalStock == null) {
            this.totalStock = 0;
        }
        if (this.reservedStock == null) {
            this.reservedStock = 0;
        }
        if (this.lowStockThreshold == null) {
            this.lowStockThreshold = 0;
        }
        if (this.reorderPoint == null) {
            this.reorderPoint = 0;
        }
        if (this.reorderQuantity == null) {
            this.reorderQuantity = 0;
        }
        if (this.trackInventory == null) {
            this.trackInventory = true;
        }
    }

    private void validateSettings() {
        if (this.lowStockThreshold < 0) {
            throw new IllegalArgumentException("Low stock threshold cannot be negative");
        }
        if (this.reorderPoint < 0) {
            throw new IllegalArgumentException("Reorder point cannot be negative");
        }
        if (this.reorderQuantity < 0) {
            throw new IllegalArgumentException("Reorder quantity cannot be negative");
        }
    }

    private void validateStockLevels() {
        if (this.totalStock < 0) {
            throw new IllegalArgumentException("Total stock cannot be negative");
        }
        if (this.reservedStock < 0) {
            throw new IllegalArgumentException("Reserved stock cannot be negative");
        }
        if (this.reservedStock > this.totalStock) {
            throw new IllegalArgumentException("Reserved stock cannot exceed total stock");
        }
    }
}
