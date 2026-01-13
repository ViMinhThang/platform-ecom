package com.ecom.promotion.dto.request;

import com.ecom.promotion.enums.ApplyMode;
import com.ecom.promotion.enums.VoucherCategory;
import com.ecom.promotion.enums.VoucherType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVoucherRequest {

    private String code; // null for auto-apply

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Type is required")
    private VoucherType type;

    @NotNull(message = "Category is required")
    private VoucherCategory category;

    @NotNull(message = "Apply mode is required")
    private ApplyMode applyMode;

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be positive")
    private BigDecimal discountValue;

    @PositiveOrZero
    private BigDecimal minOrderAmount;

    @Positive
    private BigDecimal maxDiscountAmount;

    @Positive
    private Integer usageLimit;

    @Positive
    private Integer usageLimitPerUser;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    private List<ScopeRequest> scopes;
}
