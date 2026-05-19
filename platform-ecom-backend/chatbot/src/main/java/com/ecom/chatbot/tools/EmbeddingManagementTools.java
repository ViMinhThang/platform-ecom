package com.ecom.chatbot.tools;

import com.ecom.chatbot.service.signature.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * MCP Tools for embedding management operations.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EmbeddingManagementTools {

    private final EmbeddingService embeddingService;

    @Tool(description = "Admin tool: Sync all product embeddings from the product service to the vector database")
    public String syncEmbeddings() {
        log.info("Tool sync_embeddings called");
        try {
            embeddingService.syncProductEmbeddings();
            return "Sync completed. Total embeddings: " + embeddingService.getEmbeddingCount();
        } catch (Exception e) {
            log.error("Sync failed: {}", e.getMessage());
            return "Sync failed: " + e.getMessage();
        }
    }

    @Tool(description = "Get status and statistics about the product embedding database")
    public Map<String, Object> getEmbeddingStats() {
        log.info("Tool get_embedding_stats called");
        return Map.of(
                "totalEmbeddings", embeddingService.getEmbeddingCount(),
                "status", "active",
                "service", "chatbot-service");
    }
}
