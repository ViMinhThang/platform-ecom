package com.ecom.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerReviewStatsDTO {
    private Long totalReviews;
    private Double averageRating;
    private Map<String, Long> sentimentDistribution;
    private Map<Integer, Long> ratingDistribution;
    private Long positiveCount;
    private Long neutralCount;
    private Long negativeCount;
    private Double positivePercentage;
    private Double neutralPercentage;
    private Double negativePercentage;
}
