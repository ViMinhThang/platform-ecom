package com.ecom.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MLInteractionsResponse {
    private List<UserInteractionDTO> data;
    private Long totalRecords;
    private Integer periodDays;
}
