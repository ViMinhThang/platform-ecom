package com.ecom.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleCampaignDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String bannerUrl;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<SaleCampaignItemDTO> items;
    private List<SaleCampaignCategoryDTO> categories;
    private List<SaleCampaignDiscountTierDTO> discountTiers;
    private Integer totalItems;
    private Long remainingSeconds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
