package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long productId;
    private Long variantId;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
    private LocalDateTime addedAt;

    // Product details from product service
    private String productName;
    private String variantName;
    private String imageUrl;
    private Long sellerId;
    private String sellerName;
}
