package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficSourcesDTO {
    
    private Long directViews;
    private Long searchViews;
    private Long categoryViews;
    private Long recommendationViews;
    private Long externalViews;
    
    private Double directPercentage;
    private Double searchPercentage;
    private Double categoryPercentage;
    private Double recommendationPercentage;
    private Double externalPercentage;
}
