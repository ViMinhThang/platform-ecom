package com.ecom.review.service;

import com.ecom.review.client.OrderServiceClient;
import com.ecom.review.client.ProductServiceClient;
import com.ecom.review.dto.*;
import com.ecom.review.entity.Review;
import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private static final String APPROVED_STATUS = "APPROVED";
    private static final String DELIVERED_STATUS = "DELIVERED";
    private static final String POSITIVE_SENTIMENT = "POSITIVE";
    private static final String NEUTRAL_SENTIMENT = "NEUTRAL";
    private static final String NEGATIVE_SENTIMENT = "NEGATIVE";

    private final ReviewRepository reviewRepository;
    private final OrderServiceClient orderServiceClient;
    private final ProductServiceClient productServiceClient;
    private final ModelMapper modelMapper;
    private final StreamBridge streamBridge;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public ReviewDTO createReview(CreateReviewDTO createReviewDTO, MultipartFile[] images, Long userId, String email) {
        validateNoDuplicateReview(userId, createReviewDTO.getProductId());
        validateProductExists(createReviewDTO.getProductId());
        validateOrderAndOwnership(createReviewDTO.getOrderId(), email);
        validatePurchaseVerification(email, createReviewDTO.getProductId());

        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                String fileName = fileStorageService.storeFile(file);
                createReviewDTO.getImages().add(fileName);
            }
        }

        Review review = buildReviewFromDTO(createReviewDTO, userId, email);
        Review savedReview = reviewRepository.save(review);

        publishReviewEvent("CREATED", savedReview);

        return mapToReviewDTO(savedReview);
    }

    @Override
    @Transactional
    public ReviewDTO updateReview(Long reviewId, UpdateReviewDTO updateReviewDTO, Long userId) {
        Review review = findReviewById(reviewId);
        validateReviewOwnership(review, userId);

        updateReviewFields(review, updateReviewDTO);
        Review updatedReview = reviewRepository.save(review);

        publishReviewEvent("UPDATED", updatedReview);

        return mapToReviewDTO(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = findReviewById(reviewId);
        validateReviewOwnership(review, userId);

        // Delete associated images
        if (review.getImages() != null) {
            for (String fileName : review.getImages()) {
                fileStorageService.deleteFile(fileName);
            }
        }

        reviewRepository.delete(review);
        publishReviewEvent("DELETED", review);
    }

    @Override
    public ReviewResponse getReviewsByProduct(Long productId, Integer pageNumber, Integer pageSize,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortDir);
        Page<Review> reviewPage = reviewRepository.findByProductId(productId, pageable);

        return buildReviewResponse(reviewPage);
    }

    @Override
    public ReviewResponse getReviewsByUser(Long userId, Integer pageNumber, Integer pageSize,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortDir);
        Page<Review> reviewPage = reviewRepository.findByUserId(userId, pageable);

        return buildReviewResponse(reviewPage);
    }

    @Override
    public ReviewResponse getReviewsByEmail(String email, Integer pageNumber, Integer pageSize,
            String sortBy, String sortDir) {
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortDir);
        Page<Review> reviewPage = reviewRepository.findByEmail(email, pageable);

        return buildReviewResponse(reviewPage);
    }

    @Override
    public ReviewDTO getReviewById(Long reviewId) {
        Review review = findReviewById(reviewId);
        return mapToReviewDTO(review);
    }

    @Override
    public ProductReviewSummaryDTO getProductReviewSummary(Long productId) {
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);
        List<Object[]> distributionData = reviewRepository.getRatingDistributionByProductId(productId);

        Map<Integer, Long> ratingDistribution = buildRatingDistribution(distributionData);

        return buildProductReviewSummary(productId, averageRating, totalReviews, ratingDistribution);
    }

    // ==================== Private Validation Methods ====================

    private void validateNoDuplicateReview(Long userId, Long productId) {
        if (reviewRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new APIException("You have already reviewed this product");
        }
    }

    private void validateProductExists(Long productId) {
        try {
            ResponseEntity<ProductDTO> productResponse = productServiceClient.getProductById(productId);
            if (productResponse.getBody() == null) {
                throw new ResourceNotFoundException("Product", "id", productId);
            }
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new APIException("Unable to verify product. Please try again later.");
        }
    }

    private void validateOrderAndOwnership(Long orderId, String email) {
        try {
            ResponseEntity<OrderDTO> orderResponse = orderServiceClient.getOrderById(orderId);
            OrderDTO order = orderResponse.getBody();

            if (order == null) {
                throw new ResourceNotFoundException("Order", "id", orderId);
            }

            if (!order.getEmail().equals(email)) {
                throw new APIException("This order does not belong to you");
            }

            if (!DELIVERED_STATUS.equalsIgnoreCase(order.getOrderStatus())) {
                throw new APIException("You can only review products from delivered orders");
            }
        } catch (APIException e) {
            throw e;
        } catch (Exception e) {
            throw new APIException("Unable to verify order. Please try again later.");
        }
    }

    private void validatePurchaseVerification(String email, Long productId) {
        try {
            ResponseEntity<Boolean> verifyResponse = orderServiceClient.verifyPurchase(email, productId);
            Boolean hasPurchased = verifyResponse.getBody();

            if (hasPurchased == null || !hasPurchased) {
                throw new APIException("You must purchase this product before reviewing it");
            }
        } catch (APIException e) {
            throw e;
        } catch (Exception e) {
            System.out.println("Warning: Unable to verify purchase: " + e.getMessage());
        }
    }

    private void validateReviewOwnership(Review review, Long userId) {
        if (!review.getUserId().equals(userId)) {
            throw new APIException("You can only modify your own reviews");
        }
    }

    // ==================== Private Helper Methods ====================

    private Review findReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
    }

    private Review buildReviewFromDTO(CreateReviewDTO createReviewDTO, Long userId, String email) {
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
        review.setStatus(APPROVED_STATUS);
        review.setSentiment(calculateSentiment(createReviewDTO.getRating()));

        return review;
    }

    private void updateReviewFields(Review review, UpdateReviewDTO updateReviewDTO) {
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
    }

    private Pageable createPageable(Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return PageRequest.of(pageNumber, pageSize, sort);
    }

    private ReviewResponse buildReviewResponse(Page<Review> reviewPage) {
        List<ReviewDTO> reviews = reviewPage.getContent().stream()
                .map(this::mapToReviewDTO)
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

    private Map<Integer, Long> buildRatingDistribution(List<Object[]> distributionData) {
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }

        for (Object[] data : distributionData) {
            Integer rating = (Integer) data[0];
            Long count = (Long) data[1];
            ratingDistribution.put(rating, count);
        }

        return ratingDistribution;
    }

    private ProductReviewSummaryDTO buildProductReviewSummary(Long productId, Double averageRating,
            Long totalReviews,
            Map<Integer, Long> ratingDistribution) {
        ProductReviewSummaryDTO summary = new ProductReviewSummaryDTO();
        summary.setProductId(productId);
        summary.setAverageRating(averageRating != null ? averageRating : 0.0);
        summary.setTotalReviews(totalReviews);
        summary.setRatingDistribution(ratingDistribution);

        return summary;
    }

    private ReviewDTO mapToReviewDTO(Review review) {
        return modelMapper.map(review, ReviewDTO.class);
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
        }
    }

    private String calculateSentiment(Integer rating) {
        if (rating >= 4) {
            return POSITIVE_SENTIMENT;
        } else if (rating == 3) {
            return NEUTRAL_SENTIMENT;
        } else {
            return NEGATIVE_SENTIMENT;
        }
    }

    @Override
    @Transactional
    public ReviewDTO createUnverifiedReview(CreateUnverifiedReviewDTO dto, MultipartFile[] images, Long userId) {
        validateNoDuplicateReview(userId, dto.getProductId());
        validateProductExists(dto.getProductId());

        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                String fileName = fileStorageService.storeFile(file);
                dto.getImages().add(fileName);
            }
        }

        Review review = buildUnverifiedReviewFromDTO(dto, userId);
        Review savedReview = reviewRepository.save(review);

        publishReviewEvent("CREATED", savedReview);

        return mapToReviewDTO(savedReview);
    }

    private Review buildUnverifiedReviewFromDTO(CreateUnverifiedReviewDTO dto, Long userId) {
        Review review = new Review();
        review.setProductId(dto.getProductId());
        review.setUserId(userId);
        review.setOrderId(null);
        review.setEmail(dto.getEmail());
        review.setRating(dto.getRating());
        review.setTitle(dto.getTitle());
        review.setComment(dto.getComment());
        review.setImages(dto.getImages());
        review.setVerifiedPurchase(false);
        review.setStatus(APPROVED_STATUS);
        review.setSentiment(calculateSentiment(dto.getRating()));

        return review;
    }
}
