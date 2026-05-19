package com.ecom.product.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductOptionDTO {
    private Long id;
    private String name;
    private String displayName;
    private Boolean isRequired;
    private Integer sortOrder;
    private List<ProductOptionValueDTO> values;
}
