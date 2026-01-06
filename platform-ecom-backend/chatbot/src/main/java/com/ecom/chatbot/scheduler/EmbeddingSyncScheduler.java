package com.ecom.chatbot.scheduler;

import com.ecom.chatbot.service.signature.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmbeddingSyncScheduler {

    private final EmbeddingService embeddingService;


    @Scheduled(fixedRateString = "${gemini.embedding.sync-interval:3600000}")
    public void syncEmbeddings() {
        try {
            log.info("Scheduled embeddings sync starting...");
            embeddingService.syncProductEmbeddings();
            log.info("Scheduled embeddings sync completed. Total embeddings: {}",
                    embeddingService.getEmbeddingCount());
        } catch (Exception e) {
            log.error("Error during scheduled embeddings sync: {}", e.getMessage(), e);
        }
    }
}
