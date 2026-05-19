package com.ecom.analytics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_profiles", indexes = {
        @Index(name = "idx_user_profile_last_activity", columnList = "last_activity"),
        @Index(name = "idx_user_profile_price_pref", columnList = "price_preference")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "total_purchases")
    @Builder.Default
    private Integer totalPurchases = 0;

    @Column(name = "total_cart_adds")
    @Builder.Default
    private Integer totalCartAdds = 0;

    @Column(name = "total_views")
    @Builder.Default
    private Integer totalViews = 0;

    @Column(name = "avg_order_value", precision = 12, scale = 2)
    private BigDecimal avgOrderValue;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "favorite_categories", columnDefinition = "bigint[]")
    private List<Long> favoriteCategories;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "favorite_sellers", columnDefinition = "bigint[]")
    private List<Long> favoriteSellers;

    @Column(name = "price_preference", length = 20)
    private String pricePreference; // budget, mid, premium

    @Column(name = "last_activity")
    private LocalDateTime lastActivity;

    @Column(name = "last_purchase")
    private LocalDateTime lastPurchase;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "category_scores", columnDefinition = "jsonb")
    private java.util.Map<Long, Double> categoryScores;

    @Column(name = "view_to_purchase_ratio")
    private Double viewToPurchaseRatio;

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
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
