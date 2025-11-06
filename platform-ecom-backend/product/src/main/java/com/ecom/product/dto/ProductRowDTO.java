package com.ecom.product.dto;

import com.ecom.product.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRowDTO {
    private Long id;
    private String name;
    private CategoryDTO category;
    private String imageUrl;
    private String status;
    private Integer variants;
    private String description;
}
