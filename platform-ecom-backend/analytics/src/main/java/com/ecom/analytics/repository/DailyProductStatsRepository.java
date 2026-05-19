package com.ecom.analytics.repository;

import com.ecom.analytics.entity.DailyProductStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyProductStatsRepository extends JpaRepository<DailyProductStats, Long> {
    Optional<DailyProductStats> findByProductIdAndStatDate(Long productId, LocalDate statDate);
    List<DailyProductStats> findBySellerIdAndStatDateBetween(Long sellerId, LocalDate start, LocalDate end);
    List<DailyProductStats> findByProductIdAndStatDateBetween(Long productId, LocalDate start, LocalDate end);
}
