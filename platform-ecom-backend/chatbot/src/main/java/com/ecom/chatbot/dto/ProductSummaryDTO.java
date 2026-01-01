package com.ecom.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Simplified product representation for chatbot responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummaryDTO {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String categoryName;
    private BigDecimal price;
    private Double averageRating;
    private Long totalSold;

    /**
     * Similarity score from vector search (0-1, higher is more similar)
     */
    private Double similarityScore;
}
