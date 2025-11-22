package com.ecom.product.dto;

import com.ecom.product.entity.ProductOption;
import lombok.Data;

@Data
public class ProductOptionValueDTO {
    private Long id;
    private String value;
    private String displayValue;
    private Integer sortOrder;
}
