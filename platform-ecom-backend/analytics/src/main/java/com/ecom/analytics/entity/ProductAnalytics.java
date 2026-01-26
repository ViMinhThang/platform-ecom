package com.ecom.analytics.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_analytics", indexes = {
        @Index(name = "idx_product_analytics_seller", columnList = "seller_id"),
        @Index(name = "idx_product_analytics_category", columnList = "category_id"),
        @Index(name = "idx_product_analytics_views", columnList = "total_views"),
        @Index(name = "idx_product_analytics_conversions", columnList = "conversion_rate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAnalytics {

    @Id
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "total_views")
    @Builder.Default
    private Long totalViews = 0L;

    @Column(name = "total_clicks")
    @Builder.Default
    private Long totalClicks = 0L;

    @Column(name = "total_cart_adds")
    @Builder.Default
    private Long totalCartAdds = 0L;

    @Column(name = "total_purchases")
    @Builder.Default
    private Long totalPurchases = 0L;

    @Column(name = "total_revenue", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "recommendation_impressions")
    @Builder.Default
    private Long recommendationImpressions = 0L;

    @Column(name = "recommendation_clicks")
    @Builder.Default
    private Long recommendationClicks = 0L;

    @Column(name = "search_impressions")
    @Builder.Default
    private Long searchImpressions = 0L;

    @Column(name = "search_clicks")
    @Builder.Default
    private Long searchClicks = 0L;

    // Computed metrics
    @Column(name = "click_through_rate")
    private Double clickThroughRate; // clicks / impressions

    @Column(name = "cart_rate")
    private Double cartRate; // cart_adds / views

    @Column(name = "conversion_rate")
    private Double conversionRate; // purchases / views

    @Column(name = "cart_abandonment_rate")
    private Double cartAbandonmentRate; // (cart_adds - purchases) / cart_adds

    @Column(name = "avg_view_duration_ms")
    private Long avgViewDurationMs;

    @Column(name = "last_viewed")
    private LocalDateTime lastViewed;

    @Column(name = "last_purchased")
    private LocalDateTime lastPurchased;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        recalculateMetrics();
    }

    public void recalculateMetrics() {
        if (totalViews > 0) {
            this.clickThroughRate = (double) totalClicks / totalViews;
            this.cartRate = (double) totalCartAdds / totalViews;
            this.conversionRate = (double) totalPurchases / totalViews;
        }
        if (totalCartAdds > 0) {
            this.cartAbandonmentRate = (double) (totalCartAdds - totalPurchases) / totalCartAdds;
        }
    }

    public void incrementViews() {
        this.totalViews++;
        this.lastViewed = LocalDateTime.now();
    }

    public void incrementClicks() {
        this.totalClicks++;
    }

    public void incrementCartAdds() {
        this.totalCartAdds++;
    }

    public void incrementPurchases(BigDecimal revenue) {
        this.totalPurchases++;
        this.totalRevenue = this.totalRevenue.add(revenue);
        this.lastPurchased = LocalDateTime.now();
    }
}
