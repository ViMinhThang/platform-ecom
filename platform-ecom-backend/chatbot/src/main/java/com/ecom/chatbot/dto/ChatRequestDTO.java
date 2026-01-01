package com.ecom.chatbot.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for chat interactions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequestDTO {

    @NotBlank(message = "Message is required")
    private String message;

    /**
     * Optional: specific product slug to query about
     */
    private String productSlug;

    /**
     * Optional: specific product ID to query about
     */
    private Long productId;

    /**
     * Maximum number of products to return in semantic search
     */
    @Min(1)
    @Max(20)
    @Builder.Default
    private Integer maxResults = 5;
}
