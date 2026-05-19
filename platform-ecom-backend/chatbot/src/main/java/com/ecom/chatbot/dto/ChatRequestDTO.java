package com.ecom.chatbot.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequestDTO {

    @NotBlank(message = "Message is required")
    private String message;

    private String conversationId;

    private String productSlug;

    private Long productId;

    @Min(1)
    @Max(20)
    @Builder.Default
    private Integer maxResults = 5;
}
