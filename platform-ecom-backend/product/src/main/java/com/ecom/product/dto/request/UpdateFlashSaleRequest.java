package com.ecom.product.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFlashSaleRequest {
    private String name;
    private String description;
    private String bannerUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
}
