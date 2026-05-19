package com.ecom.order.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Result of discount calculation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountResultDTO {
    private BigDecimal originalTotal;
    private BigDecimal productDiscount;
    private BigDecimal shippingDiscount;
    private BigDecimal totalDiscount;
    private BigDecimal finalTotal;

    private VoucherInfo appliedProductVoucher;
    private VoucherInfo appliedShippingVoucher;

    private List<String> warnings;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VoucherInfo {
        private Long id;
        private String code;
        private String name;
    }
}
