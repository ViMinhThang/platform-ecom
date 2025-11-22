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

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId AND r.status = 'APPROVED'")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.productId = :productId AND r.status = 'APPROVED'")
    Long countByProductId(@Param("productId") Long productId);

    @Query("SELECT r.rating as rating, COUNT(r) as count FROM Review r WHERE r.productId = :productId AND r.status = 'APPROVED' GROUP BY r.rating")
    java.util.List<Object[]> getRatingDistributionByProductId(@Param("productId") Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);
}
