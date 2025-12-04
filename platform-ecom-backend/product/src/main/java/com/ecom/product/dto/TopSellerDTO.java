package com.ecom.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for top seller information in a category
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopSellerDTO {
    private Long sellerId;
    private String sellerName;
    private String imageUrl;
}
