package com.ecom.review.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewSummaryDTO {
    private Long productId;
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> ratingDistribution = new HashMap<>(); // rating -> count
    private Map<String, Long> sentimentDistribution = new HashMap<>(); // sentiment -> count
}
