package com.ecom.review.service;

import com.ecom.review.dto.*;

public interface ReviewService {
    
    /**
     * Create a new review for a product
     * @param createReviewDTO the review data
     * @param userId the ID of the user creating the review
     * @param email the email of the user
     * @return the created review
     */
    ReviewDTO createReview(CreateReviewDTO createReviewDTO, Long userId, String email);
    
    /**
     * Update an existing review
     * @param reviewId the ID of the review to update
     * @param updateReviewDTO the updated review data
     * @param userId the ID of the user updating the review
     * @return the updated review
     */
    ReviewDTO updateReview(Long reviewId, UpdateReviewDTO updateReviewDTO, Long userId);
    
    /**
     * Delete a review
     * @param reviewId the ID of the review to delete
     * @param userId the ID of the user deleting the review
     */
    void deleteReview(Long reviewId, Long userId);
    
    /**
     * Get all reviews for a specific product
     * @param productId the ID of the product
     * @param pageNumber the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return paginated review response
     */
    ReviewResponse getReviewsByProduct(Long productId, Integer pageNumber, Integer pageSize, 
                                       String sortBy, String sortDir);
    
    /**
     * Get all reviews by a specific user
     * @param userId the ID of the user
     * @param pageNumber the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return paginated review response
     */
    ReviewResponse getReviewsByUser(Long userId, Integer pageNumber, Integer pageSize, 
                                    String sortBy, String sortDir);
    
    /**
     * Get all reviews by email
     * @param email the user's email
     * @param pageNumber the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return paginated review response
     */
    ReviewResponse getReviewsByEmail(String email, Integer pageNumber, Integer pageSize, 
                                     String sortBy, String sortDir);
    
    /**
     * Get a specific review by ID
     * @param reviewId the ID of the review
     * @return the review
     */
    ReviewDTO getReviewById(Long reviewId);
    
    /**
     * Get review summary for a product
     * @param productId the ID of the product
     * @return the product review summary
     */
    ProductReviewSummaryDTO getProductReviewSummary(Long productId);
}
