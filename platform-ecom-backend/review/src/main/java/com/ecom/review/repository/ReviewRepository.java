package com.ecom.review.repository;

import com.ecom.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByProductId(Long productId, Pageable pageable);

    Page<Review> findByUserId(Long userId, Pageable pageable);

    Page<Review> findByEmail(String email, Pageable pageable);

    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    Optional<Review> findByUserIdAndProductIdAndOrderId(Long userId, Long productId, Long orderId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.productId = :productId")
    Long countByProductId(@Param("productId") Long productId);

    @Query("SELECT r.rating as rating, COUNT(r) as count FROM Review r WHERE r.productId = :productId GROUP BY r.rating")
    java.util.List<Object[]> getRatingDistributionByProductId(@Param("productId") Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductIdAndOrderId(Long userId, Long productId, Long orderId);

    @Query("SELECT r.sentiment, COUNT(r) FROM Review r WHERE r.productId = :productId GROUP BY r.sentiment")
    java.util.List<Object[]> getSentimentDistributionByProductId(@Param("productId") Long productId);

    @Query("SELECT r FROM Review r WHERE r.productId IN :productIds")
    Page<Review> findByProductIdIn(@Param("productIds") java.util.List<Long> productIds, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.productId IN :productIds AND r.sentiment = :sentiment")
    Page<Review> findByProductIdInAndSentiment(@Param("productIds") java.util.List<Long> productIds, 
                                               @Param("sentiment") String sentiment, 
                                               Pageable pageable);

    @Query("SELECT r.sentiment, COUNT(r) FROM Review r WHERE r.productId IN :productIds GROUP BY r.sentiment")
    java.util.List<Object[]> getSentimentDistributionByProductIds(@Param("productIds") java.util.List<Long> productIds);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.productId IN :productIds")
    Long countByProductIds(@Param("productIds") java.util.List<Long> productIds);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId IN :productIds")
    Double findAverageRatingByProductIds(@Param("productIds") java.util.List<Long> productIds);
}
