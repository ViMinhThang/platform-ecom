package com.ecom.product.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.ProductDTO;
import com.ecom.product.dto.ProductDetailDTO;
import com.ecom.product.dto.ProductResponse;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.service.signature.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<APIResponse<ProductResponse>> getPublicProducts(
            PaginationRequest paginationRequest,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "search", required = false) String search) {
        ProductResponse productResponse = productService.getAllPublicProducts(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                category,
                search,
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("Products retrieved successfully", productResponse);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<APIResponse<ProductDTO>> getPublicProductById(@PathVariable Long productId) {
        ProductDTO productDTO = productService.getPublicProductById(productId);
        return ResponseBuilder.success("Product retrieved successfully", productDTO);
    }

    @GetMapping("/{productId}/with-variants")
    public ResponseEntity<APIResponse<ProductDetailDTO>> getPublicProductWithVariants(
            @PathVariable Long productId) {
        ProductDetailDTO productDetailDTO = productService.getProductWithVariants(productId);
        return ResponseBuilder.success("Product details retrieved successfully", productDetailDTO);
    }

    @GetMapping("/variants/{variantId}")
    public ResponseEntity<APIResponse<ProductVariantDTO>> getVariantById(@PathVariable Long variantId) {
        ProductVariantDTO variantDTO = productService.getVariantById(variantId);
        return ResponseBuilder.success("Variant retrieved successfully", variantDTO);
    }
}
