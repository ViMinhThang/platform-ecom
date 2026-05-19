package com.ecom.product.scheduler;

import com.ecom.product.service.signature.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class EmbeddingSyncScheduler {

    private final EmbeddingService embeddingService;

    @Scheduled(fixedDelayString = "${app.embedding.sync-interval:3600000}")
    public void syncEmbeddings() {
        log.info("Scheduled embedding sync started");
        try {
            embeddingService.syncProductEmbeddings();
        } catch (Exception e) {
            log.error("Scheduled embedding sync failed: {}", e.getMessage(), e);
        }
    }
}
