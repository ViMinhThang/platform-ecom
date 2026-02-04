package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInteractionDTO {
    private Long userId;
    private Long productId;
    private Integer weight;
}
