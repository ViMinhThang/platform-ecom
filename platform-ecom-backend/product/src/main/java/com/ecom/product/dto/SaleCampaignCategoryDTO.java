package com.ecom.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleCampaignCategoryDTO {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private String categoryImageUrl;
}
