package com.ecom.product.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
