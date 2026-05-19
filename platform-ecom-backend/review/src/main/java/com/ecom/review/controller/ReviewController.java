package com.ecom.review.controller;

import com.ecom.common.security.AuthContext;
import com.ecom.review.dto.*;
import com.ecom.review.dto.response.ReviewResponse;
import com.ecom.review.service.ReviewService;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.common.util.APIResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthContext authContext;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewDTO> createReview(
            @RequestPart("review") @Valid CreateReviewDTO createReviewDTO,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        String email = authContext.getEmail(request);

        ReviewDTO reviewDTO = reviewService.createReview(createReviewDTO, images, userId, email);
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
    public ResponseEntity<APIResponse<Object>> deleteReview(
            @PathVariable Long reviewId,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        reviewService.deleteReview(reviewId, userId);
        return ResponseBuilder.deleted("Review deleted successfully", null);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long reviewId) {
        ReviewDTO reviewDTO = reviewService.getReviewById(reviewId);
        return ResponseEntity.ok(reviewDTO);
    }

    @GetMapping("/check")
    public ResponseEntity<ReviewDTO> checkUserReview(
            @RequestParam Long productId,
            @RequestParam(required = false) Long orderId,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        ReviewDTO reviewDTO;
        if (orderId != null) {
            reviewDTO = reviewService.getReviewByUserAndProductAndOrder(userId, productId, orderId);
        } else {
            reviewDTO = reviewService.getReviewByUserAndProduct(userId, productId);
        }
        return ResponseEntity.ok(reviewDTO); // Returns 200 with review, or 200 with null body
    }

    @GetMapping("/public/product/{productId}")
    public ResponseEntity<ReviewResponse> getReviewsByProduct(
            @PathVariable Long productId,
            PaginationRequest paginationRequest) {

        ReviewResponse reviewResponse = reviewService.getReviewsByProduct(
                productId,
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ReviewResponse> getReviewsByUser(
            @PathVariable Long userId,
            PaginationRequest paginationRequest) {

        ReviewResponse reviewResponse = reviewService.getReviewsByUser(
                userId,
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/user/email/{email}")
    public ResponseEntity<ReviewResponse> getReviewsByEmail(
            @PathVariable String email,
            PaginationRequest paginationRequest) {

        ReviewResponse reviewResponse = reviewService.getReviewsByEmail(
                email,
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/public/summary/product/{productId}")
    public ResponseEntity<ProductReviewSummaryDTO> getProductReviewSummary(@PathVariable Long productId) {
        ProductReviewSummaryDTO summary = reviewService.getProductReviewSummary(productId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<ReviewResponse> getReviewsBySeller(
            @PathVariable Long sellerId,
            PaginationRequest paginationRequest,
            @RequestParam(name = "sentiment", required = false) String sentiment,
            @RequestParam(name = "productId", required = false) Long productId) {

        ReviewResponse reviewResponse = reviewService.getReviewsBySeller(
                sellerId,
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder(),
                sentiment,
                productId);
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/seller/{sellerId}/stats")
    public ResponseEntity<SellerReviewStatsDTO> getSellerReviewStats(@PathVariable Long sellerId) {
        SellerReviewStatsDTO stats = reviewService.getSellerReviewStats(sellerId);
        return ResponseEntity.ok(stats);
    }
}
