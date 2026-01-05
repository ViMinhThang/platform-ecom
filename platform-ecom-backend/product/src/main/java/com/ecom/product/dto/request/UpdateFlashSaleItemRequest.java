package com.ecom.product.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFlashSaleItemRequest {
    private BigDecimal flashSalePrice;
    private Integer stockLimit;
    private Integer sortOrder;
}
