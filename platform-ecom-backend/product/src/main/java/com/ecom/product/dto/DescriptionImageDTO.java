package com.ecom.product.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DescriptionImageDTO {
    private Long id;
    private Long productId;
    private String imageUrl;
    private LocalDateTime createdAt;
}
