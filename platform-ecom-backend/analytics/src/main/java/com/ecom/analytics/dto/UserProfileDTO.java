package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    
    private Long userId;
    private Integer totalPurchases;
    private Integer totalCartAdds;
    private Integer totalViews;
    private BigDecimal avgOrderValue;
    private List<Long> favoriteCategories;
    private List<Long> favoriteSellers;
    private String pricePreference;
    private LocalDateTime lastActivity;
    private LocalDateTime lastPurchase;
    private Double viewToPurchaseRatio;
}
