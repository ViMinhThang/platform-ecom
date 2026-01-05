package com.ecom.chatbot.controller;

import com.ecom.chatbot.dto.ChatRequestDTO;
import com.ecom.chatbot.dto.ChatResponseDTO;
import com.ecom.chatbot.service.signature.ChatbotService;
import com.ecom.chatbot.service.signature.EmbeddingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
@Slf4j
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final EmbeddingService embeddingService;


    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@Valid @RequestBody ChatRequestDTO request) {
        log.info("Received chat request: '{}'", request.getMessage());
        ChatResponseDTO response = chatbotService.chat(request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/product/{slug}/summary")
    public ResponseEntity<ChatResponseDTO> getProductSummary(@PathVariable String slug) {
        log.info("Received product summary request for slug: {}", slug);
        ChatResponseDTO response = chatbotService.getProductSummary(slug);
        return ResponseEntity.ok(response);
    }


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


    @GetMapping("/embeddings/stats")
    public ResponseEntity<Map<String, Object>> getEmbeddingStats() {
        long embeddingCount = embeddingService.getEmbeddingCount();

        return ResponseEntity.ok(Map.of(
                "totalEmbeddings", embeddingCount,
                "status", "active"));
    }


    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "chatbot-service"));
    }
}
