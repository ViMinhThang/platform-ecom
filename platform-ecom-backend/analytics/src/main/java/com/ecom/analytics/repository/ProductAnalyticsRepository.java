package com.ecom.analytics.repository;

import com.ecom.analytics.entity.ProductAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAnalyticsRepository extends JpaRepository<ProductAnalytics, Long> {
    List<ProductAnalytics> findBySellerId(Long sellerId);
    List<ProductAnalytics> findByCategoryId(Long categoryId);
}
