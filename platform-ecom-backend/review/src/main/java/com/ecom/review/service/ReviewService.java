package com.ecom.review.service;

import com.ecom.review.dto.*;

public interface ReviewService {

    ReviewDTO createReview(CreateReviewDTO createReviewDTO, Long userId, String email);
    

    ReviewDTO updateReview(Long reviewId, UpdateReviewDTO updateReviewDTO, Long userId);
    

    void deleteReview(Long reviewId, Long userId);

    ReviewResponse getReviewsByProduct(Long productId, Integer pageNumber, Integer pageSize, 
                                       String sortBy, String sortDir);
    

    ReviewResponse getReviewsByUser(Long userId, Integer pageNumber, Integer pageSize, 
                                    String sortBy, String sortDir);
    

    ReviewResponse getReviewsByEmail(String email, Integer pageNumber, Integer pageSize, 
                                     String sortBy, String sortDir);
    

    ReviewDTO getReviewById(Long reviewId);
    

    ProductReviewSummaryDTO getProductReviewSummary(Long productId);
}
