package com.ecom.order.dtos;

import lombok.Data;

@Data
public class ProductOptionValueDTO {
    private Long id;
    private String value;
    private String displayValue;
    private Integer sortOrder;
}
