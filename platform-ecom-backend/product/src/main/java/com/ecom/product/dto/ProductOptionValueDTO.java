package com.ecom.product.dto;

import lombok.Data;

@Data
public class ProductOptionValueDTO {
    private Long id;
    private String value;
    private String displayValue;
    private Integer sortOrder;
}
