package com.ecom.promotion.dto;

import com.ecom.promotion.enums.ApplyMode;
import com.ecom.promotion.enums.VoucherStatus;
import com.ecom.promotion.enums.VoucherType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private VoucherType type;
    private Long categoryId;
    private ApplyMode applyMode;
    private VoucherStatus status;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private Integer usageLimit;
    private Integer usageLimitPerUser;
    private Integer currentUsageCount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long saleCampaignId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
