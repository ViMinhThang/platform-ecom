package com.ecom.promotion.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Result of discount calculation with stacking applied
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountResult {
    private BigDecimal originalTotal;
    private BigDecimal productDiscount;
    private BigDecimal shippingDiscount;
    private BigDecimal totalDiscount;
    private BigDecimal finalTotal;

    private VoucherDTO appliedProductVoucher;
    private VoucherDTO appliedShippingVoucher;

    @Builder.Default
    private List<String> warnings = new ArrayList<>();

    public void addWarning(String warning) {
        warnings.add(warning);
    }
}
