package com.ecom.review.service;

import com.ecom.review.client.SentimentServiceClient;
import com.ecom.review.client.OrderServiceClient;
import com.ecom.review.client.ProductServiceClient;
import com.ecom.review.dto.*;
import com.ecom.review.dto.response.ReviewResponse;
import com.ecom.review.entity.Review;
import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.common.service.FileStorageService;
import com.ecom.common.util.APIResponse;
import com.ecom.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private static final String DELIVERED_STATUS = "DELIVERED";
    private static final String POSITIVE_SENTIMENT = "POSITIVE";
    private static final String NEUTRAL_SENTIMENT = "NEUTRAL";
    private static final String NEGATIVE_SENTIMENT = "NEGATIVE";

    private final ReviewRepository reviewRepository;
    private final OrderServiceClient orderServiceClient;
    private final ProductServiceClient productServiceClient;
    private final SentimentServiceClient sentimentServiceClient;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public ReviewDTO createReview(CreateReviewDTO createReviewDTO, MultipartFile[] images, Long userId, String email) {
        validateNoDuplicateReview(userId, createReviewDTO.getProductId());
        validateProductExists(createReviewDTO.getProductId());
        OrderDTO order = validateOrderAndOwnership(createReviewDTO.getOrderId(), userId);
        
        String finalEmail = (email != null && !email.trim().isEmpty())
                                ? email : order.getUserEmail();
                                
        validatePurchaseVerification(finalEmail, createReviewDTO.getProductId());

        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                String fileName = fileStorageService.storeFile(file);
                createReviewDTO.getImages().add(fileName);
            }
        }

        Review review = buildReviewFromDTO(createReviewDTO, userId, finalEmail);
        Review savedReview = reviewRepository.save(review);

        return mapToReviewDTO(savedReview);
    }

    @Override
    @Transactional
    public ReviewDTO updateReview(Long reviewId, UpdateReviewDTO updateReviewDTO, Long userId) {
        Review review = findReviewById(reviewId);
        validateReviewOwnership(review, userId);

        updateReviewFields(review, updateReviewDTO);
        Review updatedReview = reviewRepository.save(review);

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
    public ReviewDTO getReviewByUserAndProduct(Long userId, Long productId) {
        return reviewRepository.findByUserIdAndProductId(userId, productId)
                .map(this::mapToReviewDTO)
                .orElse(null);
    }

    @Override
    public ProductReviewSummaryDTO getProductReviewSummary(Long productId) {
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);
        List<Object[]> distributionData = reviewRepository.getRatingDistributionByProductId(productId);
        List<Object[]> sentimentData = reviewRepository.getSentimentDistributionByProductId(productId);

        Map<Integer, Long> ratingDistribution = buildRatingDistribution(distributionData);
        Map<String, Long> sentimentDistribution = buildSentimentDistribution(sentimentData);

        return buildProductReviewSummary(productId, averageRating, totalReviews, ratingDistribution,
                sentimentDistribution);
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

    private OrderDTO validateOrderAndOwnership(Long orderId, Long userId) {
        try {
            ResponseEntity<OrderDTO.Wrapper> response = orderServiceClient.getOrderById(orderId);
            OrderDTO.Wrapper wrapper = response.getBody();

            if (wrapper == null || wrapper.getData() == null) {
                throw new ResourceNotFoundException("Order", "id", orderId);
            }

            OrderDTO order = wrapper.getData();

            if (!order.getUserId().equals(userId)) {
                throw new APIException("This order does not belong to you");
            }

            boolean isDelivered = DELIVERED_STATUS.equalsIgnoreCase(order.getOverallStatus())
                    || "COMPLETED".equalsIgnoreCase(order.getOverallStatus());
            if (order.getSubOrders() != null) {
                isDelivered = isDelivered || order.getSubOrders().stream()
                        .anyMatch(so -> DELIVERED_STATUS.equalsIgnoreCase(so.getStatus()));
            }

            if (!isDelivered) {
                throw new APIException("You can only review products from delivered orders");
            }
            
            return order;
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
        review.setComment(createReviewDTO.getComment());
        review.setImages(createReviewDTO.getImages());

        SentimentResponse sentimentResult = analyzeSentiment(createReviewDTO.getComment());

        validateReviewLegitimacy(createReviewDTO.getRating(), sentimentResult);

        review.setSentiment(sentimentResult.getSentiment());
        review.setSentimentScore(sentimentResult.getScore());

        return review;
    }

    private void validateReviewLegitimacy(Integer rating, SentimentResponse sentimentResult) {
        if (sentimentResult.getNlpScore() == null) {
            return;
        }

        double nlpScore = sentimentResult.getNlpScore();

        if (rating >= 4 && nlpScore < 0.3) {
            throw new APIException("Đánh giá không hợp lệ");
        }
        if (rating <= 2 && nlpScore > 0.7) {
            throw new APIException("Đánh giá không hợp lệ");
        }
        if (rating == 3 && nlpScore < 0.3) {
            throw new APIException("Đánh giá không hợp lệ");
        }
        if (rating == 3 && nlpScore > 0.7) {
            throw new APIException("Đánh giá không hợp lệ");
        }
    }

    private void updateReviewFields(Review review, UpdateReviewDTO updateReviewDTO) {
        if (updateReviewDTO.getRating() != null) {
            review.setRating(updateReviewDTO.getRating());
        }
        if (updateReviewDTO.getComment() != null) {
            review.setComment(updateReviewDTO.getComment());
        }
        if (updateReviewDTO.getImages() != null) {
            review.setImages(updateReviewDTO.getImages());
        }

        // Re-analyze sentiment if comment changed
        if (updateReviewDTO.getComment() != null) {
            SentimentResponse sentimentResult = analyzeSentiment(updateReviewDTO.getComment());

            Integer rating = updateReviewDTO.getRating() != null ? updateReviewDTO.getRating() : review.getRating();
            validateReviewLegitimacy(rating, sentimentResult);

            review.setSentiment(sentimentResult.getSentiment());
            review.setSentimentScore(sentimentResult.getScore());
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

        if (distributionData == null) {
            return ratingDistribution;
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
            Map<Integer, Long> ratingDistribution,
            Map<String, Long> sentimentDistribution) {
        ProductReviewSummaryDTO summary = new ProductReviewSummaryDTO();
        summary.setProductId(productId);
        summary.setAverageRating(averageRating != null ? averageRating : 0.0);
        summary.setTotalReviews(totalReviews);
        summary.setRatingDistribution(ratingDistribution);
        summary.setSentimentDistribution(sentimentDistribution);

        return summary;
    }

    private Map<String, Long> buildSentimentDistribution(List<Object[]> sentimentData) {
        Map<String, Long> sentimentDistribution = new HashMap<>();
        sentimentDistribution.put(POSITIVE_SENTIMENT, 0L);
        sentimentDistribution.put(NEUTRAL_SENTIMENT, 0L);
        sentimentDistribution.put(NEGATIVE_SENTIMENT, 0L);

        if (sentimentData == null) {
            return sentimentDistribution;
        }

        for (Object[] data : sentimentData) {
            String sentiment = (String) data[0];
            Long count = (Long) data[1];
            sentimentDistribution.put(sentiment, count);
        }

        return sentimentDistribution;
    }

    private ReviewDTO mapToReviewDTO(Review review) {
        return modelMapper.map(review, ReviewDTO.class);
    }

    private SentimentResponse analyzeSentiment(String comment) {
        try {
            SentimentRequest request = new SentimentRequest(comment, null);
            SentimentResponse response = sentimentServiceClient.analyze(request).getBody();
            if (response != null) {
                return response;
            }
        } catch (Exception e) {
            System.out.println("Sentiment service unavailable, falling back to neutral: " + e.getMessage());
        }
        return new SentimentResponse(NEUTRAL_SENTIMENT, 0.5, 0.5);
    }

    @Override
    public ReviewResponse getReviewsBySeller(Long sellerId, Integer pageNumber, Integer pageSize,
            String sortBy, String sortDir, String sentiment, Long productId) {
        
        List<Long> productIds = getProductIdsBySeller(sellerId);
        
        if (productIds.isEmpty()) {
            Page<Review> emptyPage = Page.empty();
            return buildReviewResponse(emptyPage);
        }

        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortDir);
        Page<Review> reviewPage;

        if (productId != null) {
            reviewPage = reviewRepository.findByProductId(productId, pageable);
        } else if (sentiment != null && !sentiment.isEmpty()) {
            reviewPage = reviewRepository.findByProductIdInAndSentiment(productIds, sentiment, pageable);
        } else {
            reviewPage = reviewRepository.findByProductIdIn(productIds, pageable);
        }

        return buildReviewResponse(reviewPage);
    }

    @Override
    public SellerReviewStatsDTO getSellerReviewStats(Long sellerId) {
        List<Long> productIds = getProductIdsBySeller(sellerId);
        
        if (productIds.isEmpty()) {
            return SellerReviewStatsDTO.builder()
                    .totalReviews(0L)
                    .averageRating(0.0)
                    .sentimentDistribution(buildSentimentDistribution(null))
                    .ratingDistribution(buildRatingDistribution(null))
                    .positiveCount(0L)
                    .neutralCount(0L)
                    .negativeCount(0L)
                    .positivePercentage(0.0)
                    .neutralPercentage(0.0)
                    .negativePercentage(0.0)
                    .build();
        }

        Double averageRating = reviewRepository.findAverageRatingByProductIds(productIds);
        Long totalReviews = reviewRepository.countByProductIds(productIds);
        List<Object[]> sentimentData = reviewRepository.getSentimentDistributionByProductIds(productIds);
        List<Object[]> ratingData = reviewRepository.getRatingDistributionByProductId(productIds.get(0));

        Map<String, Long> sentimentDistribution = buildSentimentDistribution(sentimentData);
        Map<Integer, Long> ratingDistribution = buildRatingDistribution(ratingData);

        Long positiveCount = sentimentDistribution.getOrDefault(POSITIVE_SENTIMENT, 0L);
        Long neutralCount = sentimentDistribution.getOrDefault(NEUTRAL_SENTIMENT, 0L);
        Long negativeCount = sentimentDistribution.getOrDefault(NEGATIVE_SENTIMENT, 0L);

        double positivePercentage = totalReviews > 0 ? (positiveCount * 100.0 / totalReviews) : 0.0;
        double neutralPercentage = totalReviews > 0 ? (neutralCount * 100.0 / totalReviews) : 0.0;
        double negativePercentage = totalReviews > 0 ? (negativeCount * 100.0 / totalReviews) : 0.0;

        return SellerReviewStatsDTO.builder()
                .totalReviews(totalReviews)
                .averageRating(averageRating != null ? averageRating : 0.0)
                .sentimentDistribution(sentimentDistribution)
                .ratingDistribution(ratingDistribution)
                .positiveCount(positiveCount)
                .neutralCount(neutralCount)
                .negativeCount(negativeCount)
                .positivePercentage(positivePercentage)
                .neutralPercentage(neutralPercentage)
                .negativePercentage(negativePercentage)
                .build();
    }

    private List<Long> getProductIdsBySeller(Long sellerId) {
        try {
            ResponseEntity<APIResponse<List<Long>>> response = productServiceClient.getProductIdsBySellerId(sellerId);
            if (response.getBody() != null && response.getBody().getData() != null) {
                return response.getBody().getData();
            }
        } catch (Exception e) {
            System.out.println("Error fetching product IDs by seller: " + e.getMessage());
        }
        return List.of();
    }

}
