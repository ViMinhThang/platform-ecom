package com.ecom.product.controller.internal;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.ProductDTO;
import com.ecom.product.service.signature.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/internal/product-service")
@RequiredArgsConstructor
public class InternalProductController {

    private final ProductService productService;

    @GetMapping("/{productId}")
    public ResponseEntity<APIResponse<ProductDTO>> getProductById(@PathVariable Long productId) {
        ProductDTO product = productService.getProductById(productId);
        return ResponseBuilder.success("Product retrieved successfully", product);
    }

    @GetMapping("/seller/{sellerId}/ids")
    public ResponseEntity<APIResponse<List<Long>>> getProductIdsBySellerId(@PathVariable Long sellerId) {
        List<Long> productIds = productService.getProductIdsBySellerId(sellerId);
        return ResponseBuilder.success("Product IDs retrieved successfully", productIds);
    }
}
