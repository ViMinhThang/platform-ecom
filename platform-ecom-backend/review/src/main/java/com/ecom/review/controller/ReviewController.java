package com.ecom.review.controller;

import com.ecom.review.config.AppConstants;
import com.ecom.review.config.AuthContext;
import com.ecom.review.dto.*;
import com.ecom.review.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private AuthContext authContext;

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @Valid @RequestBody CreateReviewDTO createReviewDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        String email = authContext.getEmail(request);
        
        ReviewDTO reviewDTO = reviewService.createReview(createReviewDTO, userId, email);
        return new ResponseEntity<>(reviewDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody UpdateReviewDTO updateReviewDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        
        ReviewDTO reviewDTO = reviewService.updateReview(reviewId, updateReviewDTO, userId);
        return ResponseEntity.ok(reviewDTO);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<APIResponse> deleteReview(
            @PathVariable Long reviewId,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok(new APIResponse("Review deleted successfully", true));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long reviewId) {
        ReviewDTO reviewDTO = reviewService.getReviewById(reviewId);
        return ResponseEntity.ok(reviewDTO);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ReviewResponse> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_REVIEWS_BY, required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = AppConstants.SORT_DIR, required = false) String sortDir) {
        
        ReviewResponse reviewResponse = reviewService.getReviewsByProduct(productId, pageNumber, pageSize, sortBy, sortDir);
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ReviewResponse> getReviewsByUser(
            @PathVariable Long userId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_REVIEWS_BY, required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = AppConstants.SORT_DIR, required = false) String sortDir) {
        
        ReviewResponse reviewResponse = reviewService.getReviewsByUser(userId, pageNumber, pageSize, sortBy, sortDir);
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/user/email/{email}")
    public ResponseEntity<ReviewResponse> getReviewsByEmail(
            @PathVariable String email,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_REVIEWS_BY, required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = AppConstants.SORT_DIR, required = false) String sortDir) {
        
        ReviewResponse reviewResponse = reviewService.getReviewsByEmail(email, pageNumber, pageSize, sortBy, sortDir);
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/summary/product/{productId}")
    public ResponseEntity<ProductReviewSummaryDTO> getProductReviewSummary(@PathVariable Long productId) {
        ProductReviewSummaryDTO summary = reviewService.getProductReviewSummary(productId);
        return ResponseEntity.ok(summary);
    }
}
