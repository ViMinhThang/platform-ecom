package com.ecom.product.repository;

import com.ecom.product.entity.SaleCampaignCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleCampaignCategoryRepository extends JpaRepository<SaleCampaignCategory, Long> {

    List<SaleCampaignCategory> findBySaleCampaignId(Long saleCampaignId);

    void deleteBySaleCampaignId(Long saleCampaignId);
}
