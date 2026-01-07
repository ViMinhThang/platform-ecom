package com.ecom.product.repository;

import com.ecom.product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

        List<ProductVariant> findByProductId(Long productId);

        List<ProductVariant> findByProductIdAndHiddenFalse(Long productId);

        List<ProductVariant> findByProductIdAndHidden(Long productId, Boolean hidden);

        Optional<ProductVariant> findByProductIdAndId(Long productId, Long variantId);

        @Query("SELECT v FROM ProductVariant v " +
                        "JOIN v.optionValues ov " +
                        "WHERE ov.optionValue.id IN :optionValueIds " +
                        "GROUP BY v.id " +
                        "HAVING COUNT(ov.id) = :size")
        Optional<ProductVariant> findUniqueVariantByOptionValueIds(
                        @Param("optionValueIds") List<Long> optionValueIds,
                        @Param("size") long size);

        @Query("SELECT pv FROM ProductVariant pv " +
                        "JOIN pv.product p " +
                        "WHERE p.category.id IN :categoryIds " +
                        "AND p.deleted = false AND p.status = 'ACTIVE' " +
                        "AND pv.isActive = true AND pv.hidden = false " +
                        "AND pv.stock > 0 " +
                        "ORDER BY pv.price ASC")
        List<ProductVariant> findActiveByCategoryIds(@Param("categoryIds") List<Long> categoryIds);
}
