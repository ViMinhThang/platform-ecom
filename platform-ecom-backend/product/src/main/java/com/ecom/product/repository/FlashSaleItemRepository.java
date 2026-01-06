package com.ecom.product.repository;

import com.ecom.product.entity.FlashSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface FlashSaleItemRepository extends JpaRepository<FlashSaleItem, Long> {


    List<FlashSaleItem> findByFlashSaleIdOrderBySortOrderAsc(Long flashSaleId);


    Optional<FlashSaleItem> findByFlashSaleIdAndVariantId(Long flashSaleId, Long variantId);


    @Query("SELECT i FROM FlashSaleItem i " +
            "WHERE i.variant.id = :variantId " +
            "AND i.flashSale.status = 'ACTIVE' " +
            "AND i.flashSale.deleted = false " +
            "AND i.flashSale.startTime <= CURRENT_TIMESTAMP " +
            "AND i.flashSale.endTime > CURRENT_TIMESTAMP")
    Optional<FlashSaleItem> findActiveFlashSaleForVariant(@Param("variantId") Long variantId);


    @Query("SELECT i FROM FlashSaleItem i " +
            "WHERE i.flashSale.id IN :flashSaleIds " +
            "ORDER BY i.sortOrder ASC")
    List<FlashSaleItem> findByFlashSaleIds(@Param("flashSaleIds") List<Long> flashSaleIds);


    void deleteByFlashSaleId(Long flashSaleId);


    long countByFlashSaleId(Long flashSaleId);
}
