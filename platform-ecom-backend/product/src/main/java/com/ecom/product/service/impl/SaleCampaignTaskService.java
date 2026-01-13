package com.ecom.product.service.impl;

import com.ecom.product.entity.SaleCampaign;
import com.ecom.product.enums.SaleCampaignStatus;
import com.ecom.product.repository.SaleCampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleCampaignTaskService {

    private final SaleCampaignRepository saleCampaignRepository;

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void updateSaleCampaignStatuses() {
        LocalDateTime now = LocalDateTime.now();

        List<SaleCampaign> toActivate = saleCampaignRepository.findScheduledCampaignsToActivate(now);
        for (SaleCampaign campaign : toActivate) {
            campaign.setStatus(SaleCampaignStatus.ACTIVE);
            saleCampaignRepository.save(campaign);
            log.info("Auto-activated campaign: {}", campaign.getId());
        }

        List<SaleCampaign> toEnd = saleCampaignRepository.findActiveCampaignsToEnd(now);
        for (SaleCampaign campaign : toEnd) {
            campaign.setStatus(SaleCampaignStatus.ENDED);
            saleCampaignRepository.save(campaign);
            log.info("Auto-ended campaign: {}", campaign.getId());
        }
    }
}
