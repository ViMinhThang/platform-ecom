package com.ecom.order.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long orderItemId;
    private ProductDTO product;
    private ProductVariantDTO productVariant;
    private Integer quantity;
    private double discount;
    private double orderedProductPrice;
}