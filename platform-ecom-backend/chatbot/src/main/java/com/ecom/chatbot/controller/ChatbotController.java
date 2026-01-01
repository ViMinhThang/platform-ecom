package com.ecom.chatbot.controller;

import com.ecom.chatbot.dto.ChatRequestDTO;
import com.ecom.chatbot.dto.ChatResponseDTO;
import com.ecom.chatbot.service.ChatbotService;
import com.ecom.chatbot.service.EmbeddingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for chatbot interactions.
 */
@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
@Slf4j
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final EmbeddingService embeddingService;

    /**
     * Process a chat message and return AI-generated response with relevant
     * products.
     *
     * @param request Chat request containing user message
     * @return AI response with product recommendations
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@Valid @RequestBody ChatRequestDTO request) {
        log.info("Received chat request: '{}'", request.getMessage());
        ChatResponseDTO response = chatbotService.chat(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get AI-generated summary for a specific product.
     *
     * @param slug Product slug
     * @return AI summary of the product
     */
    @GetMapping("/product/{slug}/summary")
    public ResponseEntity<ChatResponseDTO> getProductSummary(@PathVariable String slug) {
        log.info("Received product summary request for slug: {}", slug);
        ChatResponseDTO response = chatbotService.getProductSummary(slug);
        return ResponseEntity.ok(response);
    }

    /**
     * Manually trigger embedding synchronization.
     * This is an admin endpoint to force sync of product embeddings.
     *
     * @return Status message
     */
    @PostMapping("/embeddings/sync")
    public ResponseEntity<Map<String, Object>> syncEmbeddings() {
        log.info("Manual embeddings sync triggered");
        long startTime = System.currentTimeMillis();

        embeddingService.syncProductEmbeddings();

        long duration = System.currentTimeMillis() - startTime;
        long embeddingCount = embeddingService.getEmbeddingCount();

        return ResponseEntity.ok(Map.of(
                "status", "completed",
                "message", "Embeddings sync completed successfully",
                "embeddingsCount", embeddingCount,
                "durationMs", duration));
    }

    /**
     * Get embedding statistics.
     *
     * @return Statistics about stored embeddings
     */
    @GetMapping("/embeddings/stats")
    public ResponseEntity<Map<String, Object>> getEmbeddingStats() {
        long embeddingCount = embeddingService.getEmbeddingCount();

        return ResponseEntity.ok(Map.of(
                "totalEmbeddings", embeddingCount,
                "status", "active"));
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "chatbot-service"));
    }
}
