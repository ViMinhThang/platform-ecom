package com.ecom.product.repository;

import com.ecom.product.entity.SaleCampaign;
import com.ecom.product.enums.SaleCampaignStatus;
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
public interface SaleCampaignRepository extends JpaRepository<SaleCampaign, Long> {

    List<SaleCampaign> findByStatusAndDeletedFalse(SaleCampaignStatus status);

    Page<SaleCampaign> findByDeletedFalse(Pageable pageable);

    Page<SaleCampaign> findByStatusAndDeletedFalse(SaleCampaignStatus status, Pageable pageable);

    Optional<SaleCampaign> findBySlugAndDeletedFalse(String slug);

    Optional<SaleCampaign> findByIdAndDeletedFalse(Long id);

    @Query("SELECT s FROM SaleCampaign s WHERE s.status = 'ACTIVE' " +
            "AND s.startTime <= :now AND s.endTime > :now AND s.deleted = false " +
            "ORDER BY s.startTime DESC")
    List<SaleCampaign> findActiveCampaigns(@Param("now") LocalDateTime now);

    @Query("SELECT s FROM SaleCampaign s WHERE s.status = 'SCHEDULED' " +
            "AND s.startTime <= :now AND s.deleted = false")
    List<SaleCampaign> findScheduledCampaignsToActivate(@Param("now") LocalDateTime now);

    @Query("SELECT s FROM SaleCampaign s WHERE s.status = 'ACTIVE' " +
            "AND s.endTime <= :now AND s.deleted = false")
    List<SaleCampaign> findActiveCampaignsToEnd(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(s) > 0 FROM SaleCampaign s JOIN s.items i " +
            "WHERE i.variant.id = :variantId " +
            "AND s.deleted = false " +
            "AND s.status IN ('SCHEDULED', 'ACTIVE') " +
            "AND ((s.startTime <= :endTime AND s.endTime >= :startTime))")
    boolean existsOverlappingCampaign(
            @Param("variantId") Long variantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT COUNT(s) > 0 FROM SaleCampaign s JOIN s.items i " +
            "WHERE i.variant.id = :variantId " +
            "AND s.id != :excludeId " +
            "AND s.deleted = false " +
            "AND s.status IN ('SCHEDULED', 'ACTIVE') " +
            "AND ((s.startTime <= :endTime AND s.endTime >= :startTime))")
    boolean existsOverlappingCampaignExcluding(
            @Param("variantId") Long variantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId);
}
