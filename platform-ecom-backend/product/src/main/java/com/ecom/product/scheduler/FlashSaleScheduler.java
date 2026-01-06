package com.ecom.product.scheduler;

import com.ecom.product.service.signature.FlashSaleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class FlashSaleScheduler {

    private final FlashSaleService flashSaleService;


    @Scheduled(fixedRate = 60000)
    public void updateFlashSaleStatuses() {
        log.debug("Running flash sale status update job...");
        try {
            flashSaleService.updateFlashSaleStatuses();
        } catch (Exception e) {
            log.error("Error updating flash sale statuses", e);
        }
    }
}
