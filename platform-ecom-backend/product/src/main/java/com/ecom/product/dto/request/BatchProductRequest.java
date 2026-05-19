package com.ecom.product.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BatchProductRequest {
    @NotEmpty(message = "Product IDs list cannot be empty")
    private List<Long> productIds;
}
