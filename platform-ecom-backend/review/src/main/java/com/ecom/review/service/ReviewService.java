package com.ecom.review.service;

import com.ecom.review.dto.*;
import com.ecom.review.dto.response.ReviewResponse;

import org.springframework.web.multipart.MultipartFile;

public interface ReviewService {

        ReviewDTO createReview(CreateReviewDTO createReviewDTO, MultipartFile[] images, Long userId, String email);

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
