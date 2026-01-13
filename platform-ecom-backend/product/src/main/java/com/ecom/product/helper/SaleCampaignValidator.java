package com.ecom.product.helper;

import com.ecom.product.dto.request.DiscountTierRequest;
import com.ecom.product.entity.SaleCampaign;
import com.ecom.product.enums.SaleCampaignStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SaleCampaignValidator {

    public void validateTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime.isBefore(startTime) || endTime.isEqual(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
    }

    public void validateModification(SaleCampaign campaign) {
        if (campaign.getStatus() == SaleCampaignStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify an active sale campaign");
        }
    }

    public void validateDeletion(SaleCampaign campaign) {
        if (campaign.getStatus() == SaleCampaignStatus.ACTIVE) {
            throw new IllegalStateException("Cannot delete an active sale campaign. Cancel it first.");
        }
    }

    public void validateActivation(SaleCampaign campaign) {
        if (campaign.getCategories().isEmpty()) {
            throw new IllegalStateException("Cannot activate a campaign without categories");
        }

        if (campaign.getDiscountTiers().isEmpty()) {
            throw new IllegalStateException("Cannot activate a campaign without discount tiers");
        }
    }

    public void validateDiscountTiers(List<DiscountTierRequest> tierRequests) {
        for (DiscountTierRequest tierReq : tierRequests) {
            if (tierReq.getMinPrice().compareTo(tierReq.getMaxPrice()) > 0) {
                throw new IllegalArgumentException("Min price cannot be greater than max price");
            }
        }
    }
}
