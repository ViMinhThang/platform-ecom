package com.ecom.product.scheduler;

import com.ecom.product.service.signature.SaleCampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SaleCampaignScheduler {

    private final SaleCampaignService saleCampaignService;

    @Scheduled(fixedRate = 60000)
    public void updateCampaignStatuses() {
        try {
            saleCampaignService.updateSaleCampaignStatuses();
        } catch (Exception e) {
            log.error("Error updating sale campaign statuses", e);
        }
    }
}
