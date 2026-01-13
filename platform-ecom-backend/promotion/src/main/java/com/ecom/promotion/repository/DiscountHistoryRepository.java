package com.ecom.promotion.repository;

import com.ecom.promotion.entity.ProductDiscountHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiscountHistoryRepository extends JpaRepository<ProductDiscountHistory, Long> {

        List<ProductDiscountHistory> findByProductIdOrderByStartTimeDesc(Long productId);

        List<ProductDiscountHistory> findByVariantIdOrderByStartTimeDesc(Long variantId);

        /**
         * Best discount ever for a product (highest discount percent)
         */
        @Query("""
                        SELECT h FROM ProductDiscountHistory h
                        WHERE h.productId = :productId
                        ORDER BY h.discountPercent DESC
                        """)
        List<ProductDiscountHistory> findBestDiscountForProduct(
                        @Param("productId") Long productId,
                        Pageable pageable);

        /**
         * Recent discounts for a product
         */
        @Query("""
                        SELECT h FROM ProductDiscountHistory h
                        WHERE h.productId = :productId
                        AND h.endTime > :since
                        ORDER BY h.endTime DESC
                        """)
        List<ProductDiscountHistory> findRecentDiscountsForProduct(
                        @Param("productId") Long productId,
                        @Param("since") LocalDateTime since);

        /**
         * Products with highest discounts in a time period
         */
        @Query("""
                        SELECT h FROM ProductDiscountHistory h
                        WHERE h.startTime >= :startTime
                        ORDER BY h.discountPercent DESC
                        """)
        List<ProductDiscountHistory> findTopDiscountsInPeriod(
                        @Param("startTime") LocalDateTime startTime,
                        Pageable pageable);
}
