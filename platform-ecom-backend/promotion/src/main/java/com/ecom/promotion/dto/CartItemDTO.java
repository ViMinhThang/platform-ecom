package com.ecom.promotion.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Cart item for discount calculation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long productId;
    private Long variantId;
    private Long categoryId;
    private BigDecimal price;
    private Integer quantity;
}
