package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrendingProductDTO {
    private Long productId;
    private Integer score;
}
