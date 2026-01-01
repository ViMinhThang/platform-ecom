package com.ecom.chatbot.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for product data received from Product service.
 * Matches the actual API response structure.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;

    // API returns 'category' but we also accept 'cate' for flexibility
    @JsonAlias({ "cate", "category" })
    private CategoryDTO category;

    private String status;
    private BigDecimal minPrice;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long totalSold;
    private Long totalReviews;
    private Double averageRating;
    private Long userId;

    /**
     * Convenience getter for category (alias for getCate compatibility)
     */
    public CategoryDTO getCate() {
        return category;
    }
}
