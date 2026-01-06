package com.ecom.product.repository;

import com.ecom.product.entity.FlashSale;
import com.ecom.product.enums.FlashSaleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {

    List<FlashSale> findByStatusAndDeletedFalse(FlashSaleStatus status);


    Page<FlashSale> findByDeletedFalse(Pageable pageable);


    Page<FlashSale> findByStatusAndDeletedFalse(FlashSaleStatus status, Pageable pageable);


    Optional<FlashSale> findBySlugAndDeletedFalse(String slug);

    Optional<FlashSale> findByIdAndDeletedFalse(Long id);


    @Query("SELECT f FROM FlashSale f WHERE f.status = 'ACTIVE' " +
            "AND f.startTime <= :now AND f.endTime > :now AND f.deleted = false " +
            "ORDER BY f.startTime DESC")
    List<FlashSale> findActiveFlashSales(@Param("now") LocalDateTime now);


    @Query("SELECT f FROM FlashSale f WHERE f.status = 'SCHEDULED' " +
            "AND f.startTime <= :now AND f.deleted = false")
    List<FlashSale> findScheduledFlashSalesToActivate(@Param("now") LocalDateTime now);


    @Query("SELECT f FROM FlashSale f WHERE f.status = 'ACTIVE' " +
            "AND f.endTime <= :now AND f.deleted = false")
    List<FlashSale> findActiveFlashSalesToEnd(@Param("now") LocalDateTime now);


    @Query("SELECT COUNT(f) > 0 FROM FlashSale f JOIN f.items i " +
            "WHERE i.variant.id = :variantId " +
            "AND f.deleted = false " +
            "AND f.status IN ('SCHEDULED', 'ACTIVE') " +
            "AND ((f.startTime <= :endTime AND f.endTime >= :startTime))")
    boolean existsOverlappingFlashSale(
            @Param("variantId") Long variantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);


    @Query("SELECT COUNT(f) > 0 FROM FlashSale f JOIN f.items i " +
            "WHERE i.variant.id = :variantId " +
            "AND f.id != :excludeId " +
            "AND f.deleted = false " +
            "AND f.status IN ('SCHEDULED', 'ACTIVE') " +
            "AND ((f.startTime <= :endTime AND f.endTime >= :startTime))")
    boolean existsOverlappingFlashSaleExcluding(
            @Param("variantId") Long variantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId);
}
