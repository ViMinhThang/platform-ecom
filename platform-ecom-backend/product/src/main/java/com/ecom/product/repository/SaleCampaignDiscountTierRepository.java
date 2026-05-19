package com.ecom.product.repository;

import com.ecom.product.entity.SaleCampaignDiscountTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleCampaignDiscountTierRepository extends JpaRepository<SaleCampaignDiscountTier, Long> {

    List<SaleCampaignDiscountTier> findBySaleCampaignIdOrderBySortOrderAsc(Long saleCampaignId);

    void deleteBySaleCampaignId(Long saleCampaignId);
}
