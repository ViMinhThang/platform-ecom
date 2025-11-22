package com.ecom.review.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEvent {
    private String eventType; // CREATED, UPDATED, DELETED
    private Long reviewId;
    private Long productId;
    private Long userId;
    private Integer rating;
    private String timestamp;
}
