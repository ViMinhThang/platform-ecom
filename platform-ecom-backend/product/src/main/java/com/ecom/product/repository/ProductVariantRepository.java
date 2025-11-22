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

    Optional<ProductVariant> findByProductIdAndId(Long productId, Long variantId);
    @Query("SELECT v FROM ProductVariant v " +
            "JOIN v.optionValues ov " +
            "WHERE ov.optionValue.id IN :optionValueIds " +
            "GROUP BY v.id " +
            "HAVING COUNT(ov.id) = :size")
    Optional<ProductVariant> findUniqueVariantByOptionValueIds(
            @Param("optionValueIds") List<Long> optionValueIds,
            @Param("size") long size
    );
}
