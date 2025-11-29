package com.ecom.order.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDTO {
    private Long id;
    private String sku;
    private BigDecimal price;
    private BigDecimal salePrice;
    private String imageUrl;
    private List<VariantOptionValueDTO> optionValues;
}
