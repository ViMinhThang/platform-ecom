package com.ecom.review.service;

import com.ecom.review.client.OrderServiceClient;
import com.ecom.review.client.ProductServiceClient;
import com.ecom.review.dto.*;
import com.ecom.review.entity.Review;
import com.ecom.review.exception.APIException;
import com.ecom.review.exception.ResourceNotFoundException;
import com.ecom.review.repository.ReviewRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderServiceClient orderServiceClient;

    @Autowired
    private ProductServiceClient productServiceClient;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private StreamBridge streamBridge;

    @Transactional
    public ReviewDTO createReview(CreateReviewDTO createReviewDTO, Long userId, String email) {
        // Check if user already reviewed this product
        if (reviewRepository.existsByUserIdAndProductId(userId, createReviewDTO.getProductId())) {
            throw new APIException("You have already reviewed this product");
        }

        // Verify product exists
        try {
            ResponseEntity<ProductDTO> productResponse = productServiceClient.getProductById(createReviewDTO.getProductId());
            if (productResponse.getBody() == null) {
                throw new ResourceNotFoundException("Product", "id", createReviewDTO.getProductId());
            }
        } catch (Exception e) {
            throw new APIException("Unable to verify product. Please try again later.");
        }

        // Verify order exists and belongs to user
        try {
            ResponseEntity<OrderDTO> orderResponse = orderServiceClient.getOrderById(createReviewDTO.getOrderId());
            OrderDTO order = orderResponse.getBody();
            
            if (order == null) {
                throw new ResourceNotFoundException("Order", "id", createReviewDTO.getOrderId());
            }

            if (!order.getEmail().equals(email)) {
                throw new APIException("This order does not belong to you");
            }

            // Check if order is delivered
            if (!"DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
                throw new APIException("You can only review products from delivered orders");
            }
        } catch (ResourceNotFoundException | APIException e) {
            throw e;
        } catch (Exception e) {
            throw new APIException("Unable to verify order. Please try again later.");
        }

        // Verify user purchased this product (via order service)
        try {
            ResponseEntity<Boolean> verifyResponse = orderServiceClient.verifyPurchase(email, createReviewDTO.getProductId());
            Boolean hasPurchased = verifyResponse.getBody();
            
            if (hasPurchased == null || !hasPurchased) {
                throw new APIException("You must purchase this product before reviewing it");
            }
        } catch (APIException e) {
            throw e;
        } catch (Exception e) {
            // If verification endpoint doesn't exist yet, we can skip this check
            System.out.println("Warning: Unable to verify purchase: " + e.getMessage());
        }

        // Create review
        Review review = new Review();
        review.setProductId(createReviewDTO.getProductId());
        review.setUserId(userId);
        review.setOrderId(createReviewDTO.getOrderId());
        review.setEmail(email);
        review.setRating(createReviewDTO.getRating());
        review.setTitle(createReviewDTO.getTitle());
        review.setComment(createReviewDTO.getComment());
        review.setImages(createReviewDTO.getImages());
        review.setVerifiedPurchase(true);
        review.setStatus("APPROVED");
        review.setSentiment(calculateSentiment(createReviewDTO.getRating()));

        Review savedReview = reviewRepository.save(review);

        // Publish event to Kafka
        publishReviewEvent("CREATED", savedReview);

        return modelMapper.map(savedReview, ReviewDTO.class);
    }

    @Transactional
    public ReviewDTO updateReview(Long reviewId, UpdateReviewDTO updateReviewDTO, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        // Check ownership
        if (!review.getUserId().equals(userId)) {
            throw new APIException("You can only update your own reviews");
        }

        // Update fields
        if (updateReviewDTO.getRating() != null) {
            review.setRating(updateReviewDTO.getRating());
            review.setSentiment(calculateSentiment(updateReviewDTO.getRating()));
        }
        if (updateReviewDTO.getTitle() != null) {
            review.setTitle(updateReviewDTO.getTitle());
        }
        if (updateReviewDTO.getComment() != null) {
            review.setComment(updateReviewDTO.getComment());
        }
        if (updateReviewDTO.getImages() != null) {
            review.setImages(updateReviewDTO.getImages());
        }

        Review updatedReview = reviewRepository.save(review);

        // Publish event to Kafka
        publishReviewEvent("UPDATED", updatedReview);

        return modelMapper.map(updatedReview, ReviewDTO.class);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        // Check ownership
        if (!review.getUserId().equals(userId)) {
            throw new APIException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);

        // Publish event to Kafka
        publishReviewEvent("DELETED", review);
    }

    public ReviewResponse getReviewsByProduct(Long productId, Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Review> reviewPage = reviewRepository.findByProductId(productId, pageable);

        List<ReviewDTO> reviews = reviewPage.getContent().stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .collect(Collectors.toList());

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setContent(reviews);
        reviewResponse.setPageNumber(reviewPage.getNumber());
        reviewResponse.setPageSize(reviewPage.getSize());
        reviewResponse.setTotalElements(reviewPage.getTotalElements());
        reviewResponse.setTotalPages(reviewPage.getTotalPages());
        reviewResponse.setIsLast(reviewPage.isLast());

        return reviewResponse;
    }

    public ReviewResponse getReviewsByUser(Long userId, Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Review> reviewPage = reviewRepository.findByUserId(userId, pageable);

        List<ReviewDTO> reviews = reviewPage.getContent().stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .collect(Collectors.toList());

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setContent(reviews);
        reviewResponse.setPageNumber(reviewPage.getNumber());
        reviewResponse.setPageSize(reviewPage.getSize());
        reviewResponse.setTotalElements(reviewPage.getTotalElements());
        reviewResponse.setTotalPages(reviewPage.getTotalPages());
        reviewResponse.setIsLast(reviewPage.isLast());

        return reviewResponse;
    }

    public ReviewResponse getReviewsByEmail(String email, Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Review> reviewPage = reviewRepository.findByEmail(email, pageable);

        List<ReviewDTO> reviews = reviewPage.getContent().stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .collect(Collectors.toList());

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setContent(reviews);
        reviewResponse.setPageNumber(reviewPage.getNumber());
        reviewResponse.setPageSize(reviewPage.getSize());
        reviewResponse.setTotalElements(reviewPage.getTotalElements());
        reviewResponse.setTotalPages(reviewPage.getTotalPages());
        reviewResponse.setIsLast(reviewPage.isLast());

        return reviewResponse;
    }

    public ReviewDTO getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        return modelMapper.map(review, ReviewDTO.class);
    }

    public ProductReviewSummaryDTO getProductReviewSummary(Long productId) {
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);
        List<Object[]> distributionData = reviewRepository.getRatingDistributionByProductId(productId);

        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }

        for (Object[] data : distributionData) {
            Integer rating = (Integer) data[0];
            Long count = (Long) data[1];
            ratingDistribution.put(rating, count);
        }

        ProductReviewSummaryDTO summary = new ProductReviewSummaryDTO();
        summary.setProductId(productId);
        summary.setAverageRating(averageRating != null ? averageRating : 0.0);
        summary.setTotalReviews(totalReviews);
        summary.setRatingDistribution(ratingDistribution);

        return summary;
    }

    private void publishReviewEvent(String eventType, Review review) {
        try {
            ReviewEvent event = new ReviewEvent();
            event.setEventType(eventType);
            event.setReviewId(review.getId());
            event.setProductId(review.getProductId());
            event.setUserId(review.getUserId());
            event.setRating(review.getRating());
            event.setTimestamp(LocalDateTime.now().toString());

            streamBridge.send("reviewCreated-out-0", event);
            System.out.println("Published review event: " + eventType + " for review " + review.getId());
        } catch (Exception e) {
            System.err.println("Failed to publish review event: " + e.getMessage());
            // Don't fail the operation if event publishing fails
        }
    }

    private String calculateSentiment(Integer rating) {
        if (rating >= 4) {
            return "POSITIVE";
        } else if (rating == 3) {
            return "NEUTRAL";
        } else {
            return "NEGATIVE";
        }
    }
}
