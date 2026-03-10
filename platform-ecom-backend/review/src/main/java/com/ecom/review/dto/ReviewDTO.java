package com.ecom.review.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long productId;
    private Long userId;
    private Long orderId;
    private String email;
    private Integer rating;
    private String comment;
    private List<String> images = new ArrayList<>();
    private Integer helpfulCount;
    private Integer notHelpfulCount;
    private String sentiment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
