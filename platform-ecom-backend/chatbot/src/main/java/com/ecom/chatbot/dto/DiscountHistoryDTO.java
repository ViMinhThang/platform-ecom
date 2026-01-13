package com.ecom.chatbot.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountHistoryDTO {
    private Long id;
    private Long productId;
    private Long variantId;
    private String discountName;
    private BigDecimal originalPrice;
    private BigDecimal discountedPrice;
    private Integer discountPercent;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isActive;
}
