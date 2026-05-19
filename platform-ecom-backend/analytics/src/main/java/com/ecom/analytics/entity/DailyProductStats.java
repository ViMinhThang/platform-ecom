package com.ecom.analytics.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_product_stats", indexes = {
        @Index(name = "idx_daily_stats_product_date", columnList = "product_id, stat_date"),
        @Index(name = "idx_daily_stats_seller_date", columnList = "seller_id, stat_date"),
        @Index(name = "idx_daily_stats_date", columnList = "stat_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyProductStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "stat_date", nullable = false)
    private LocalDate statDate;

    @Column(name = "views")
    @Builder.Default
    private Integer views = 0;

    @Column(name = "clicks")
    @Builder.Default
    private Integer clicks = 0;

    @Column(name = "cart_adds")
    @Builder.Default
    private Integer cartAdds = 0;

    @Column(name = "cart_removes")
    @Builder.Default
    private Integer cartRemoves = 0;

    @Column(name = "purchases")
    @Builder.Default
    private Integer purchases = 0;

    @Column(name = "revenue", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal revenue = BigDecimal.ZERO;

    @Column(name = "unique_viewers")
    @Builder.Default
    private Integer uniqueViewers = 0;

    @Column(name = "recommendation_impressions")
    @Builder.Default
    private Integer recommendationImpressions = 0;

    @Column(name = "recommendation_clicks")
    @Builder.Default
    private Integer recommendationClicks = 0;

    @Column(name = "search_impressions")
    @Builder.Default
    private Integer searchImpressions = 0;

    @Column(name = "search_clicks")
    @Builder.Default
    private Integer searchClicks = 0;

    @Column(name = "avg_view_duration_ms")
    private Integer avgViewDurationMs;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
