package com.ecom.order.repository;

import com.ecom.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * Delete all cart items across all carts matching productId and variantId.
     * Used when inventory runs out of stock.
     */
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.productId = :productId AND ci.variantId = :variantId")
    int deleteByProductIdAndVariantId(@Param("productId") Long productId, @Param("variantId") Long variantId);

    /**
     * Delete all cart items for a product (when variantId is null or product is
     * discontinued)
     */
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.productId = :productId")
    int deleteByProductId(@Param("productId") Long productId);
}
