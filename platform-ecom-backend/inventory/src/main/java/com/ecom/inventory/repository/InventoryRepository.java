package com.ecom.inventory.repository;

import com.ecom.inventory.entity.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByVariantId(Long variantId);

    Optional<Inventory> findBySku(String sku);

    List<Inventory> findByProductId(Long productId);

    /**
     * Find with pessimistic lock for concurrent updates
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.variantId = :variantId")
    Optional<Inventory> findByVariantIdForUpdate(@Param("variantId") Long variantId);

    /**
     * Find all items with low stock
     */
    @Query("SELECT i FROM Inventory i WHERE i.trackInventory = true AND i.availableStock <= i.lowStockThreshold")
    List<Inventory> findLowStockItems();

    /**
     * Check if variant exists in inventory
     */
    boolean existsByVariantId(Long variantId);

    /**
     * Find by seller (via product IDs)
     */
    @Query("SELECT i FROM Inventory i WHERE i.productId IN :productIds")
    List<Inventory> findByProductIdIn(@Param("productIds") List<Long> productIds);

    /**
     * Find by seller (via product IDs) with pagination
     */
    @Query("SELECT i FROM Inventory i WHERE i.productId IN :productIds")
    Page<Inventory> findByProductIdIn(@Param("productIds") List<Long> productIds, Pageable pageable);

    /**
     * Find low stock items by seller (via product IDs)
     */
    @Query("SELECT i FROM Inventory i WHERE i.productId IN :productIds AND i.trackInventory = true AND i.availableStock <= i.lowStockThreshold")
    List<Inventory> findLowStockItemsByProductIds(@Param("productIds") List<Long> productIds);
}
