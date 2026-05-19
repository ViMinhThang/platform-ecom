package com.ecom.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MLTrendingResponse {
    private List<TrendingProductDTO> data;
    private Long totalRecords;
    private Integer periodDays;
}
