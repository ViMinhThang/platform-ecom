package com.ecom.product.repository;

import com.ecom.product.entity.FlashSale;
import com.ecom.product.enums.FlashSaleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {

    Optional<FlashSale> findByIdAndDeletedFalse(Long id);

    Optional<FlashSale> findBySlugAndDeletedFalse(String slug);

    Page<FlashSale> findByDeletedFalse(Pageable pageable);

    Page<FlashSale> findByStatusAndDeletedFalse(FlashSaleStatus status, Pageable pageable);

    List<FlashSale> findByStatusAndDeletedFalse(FlashSaleStatus status);

    @Query("SELECT f FROM FlashSale f WHERE f.status = :status AND f.deleted = false " +
           "AND f.startTime <= :now AND f.endTime >= :now")
    List<FlashSale> findActiveFlashSales(@Param("status") FlashSaleStatus status, @Param("now") java.time.LocalDateTime now);

    boolean existsBySlug(String slug);
}
