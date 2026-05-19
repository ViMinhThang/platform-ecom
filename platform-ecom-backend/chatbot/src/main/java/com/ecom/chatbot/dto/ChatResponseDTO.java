package com.ecom.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for chat interactions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponseDTO {

    /**
     * AI-generated response message
     */
    private String message;

    /**
     * List of relevant products found via semantic search
     */
    private List<ProductSummaryDTO> products;

    /**
     * Timestamp of the response
     */
    private LocalDateTime timestamp;

    /**
     * Query processing time in milliseconds
     */
    private Long processingTimeMs;

    /**
     * Whether to show support info (product not found or error)
     */
    @Builder.Default
    private Boolean showSupportInfo = false;
}
