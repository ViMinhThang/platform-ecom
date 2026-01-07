package com.ecom.product.repository;

import com.ecom.product.entity.SaleCampaignItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleCampaignItemRepository extends JpaRepository<SaleCampaignItem, Long> {

    List<SaleCampaignItem> findBySaleCampaignIdOrderBySortOrderAsc(Long saleCampaignId);

    void deleteBySaleCampaignId(Long saleCampaignId);

    @Query("SELECT i FROM SaleCampaignItem i " +
            "JOIN i.saleCampaign s " +
            "WHERE i.variant.id = :variantId " +
            "AND s.status = 'ACTIVE' " +
            "AND s.deleted = false " +
            "AND s.startTime <= CURRENT_TIMESTAMP " +
            "AND s.endTime > CURRENT_TIMESTAMP")
    Optional<SaleCampaignItem> findActiveSaleForVariant(@Param("variantId") Long variantId);
}
