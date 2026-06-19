package com.ecom.product.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.*;
import com.ecom.product.dto.request.BatchProductRequest;
import com.ecom.product.dto.response.ProductResponse;
import com.ecom.product.service.signature.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<APIResponse<ProductResponse>> getPublicProducts(
            PaginationRequest paginationRequest,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "minRating", required = false) Double minRating,
            @RequestParam(name = "inStock", required = false) Boolean inStock,
            @RequestParam(name = "sellerIds", required = false) List<Long> sellerIds) {
        ProductResponse productResponse = productService.getAllPublicProducts(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                category,
                search,
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder(),
                minPrice,
                maxPrice,
                minRating,
                inStock,
                sellerIds);
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

    @GetMapping("/{productId}/variants/{variantId}")
    public ResponseEntity<APIResponse<ProductVariantDetailDTO>> getProductVariantDetails(
            @PathVariable Long productId,
            @PathVariable Long variantId) {

        ProductDTO product = productService.getPublicProductById(productId);
        ProductVariantDTO variant = productService.getVariantById(variantId);

        String variantName = "Default";
        if (variant.getOptionValues() != null && !variant.getOptionValues().isEmpty()) {
            variantName = variant.getOptionValues().stream()
                    .filter(opt -> opt.getProductOptionValue() != null)
                    .map(opt -> opt.getProductOptionValue().getValue())
                    .reduce((a, b) -> a + " - " + b)
                    .orElse("Default");
        }

        ProductVariantDetailDTO detailDTO = ProductVariantDetailDTO.builder()
                .productId(product.getId())
                .name(product.getName())
                .imageUrl(variant.getImageUrl() != null ? variant.getImageUrl() : "https://placeholder.com/image.jpg") // Fallback
                .sellerId(product.getUserId())
                .sellerName("Seller " + product.getUserId()) // Placeholder
                .variantName(variantName)
                .price(variant.getSalePrice() != null ? variant.getSalePrice() : variant.getPrice())
                .stockQuantity(variant.getStock())
                .build();

        return ResponseBuilder.success("Product variant details retrieved successfully", detailDTO);
    }

    @GetMapping("/categories/{categorySlug}/top-sellers")
    public ResponseEntity<APIResponse<List<TopSellerDTO>>> getTopSellers(
            @PathVariable String categorySlug,
            @RequestParam(defaultValue = "10") int limit) {
        var topSellers = productService.getTopSellersByCategory(categorySlug, limit);
        return ResponseBuilder.success("Top sellers retrieved successfully", topSellers);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<APIResponse<ProductDetailDTO>> getProductBySlug(@PathVariable String slug) {
        // Decode URL-encoded slug (handles cases where slug is stored encoded)
        String decodedSlug = java.net.URLDecoder.decode(slug, java.nio.charset.StandardCharsets.UTF_8);
        ProductDetailDTO product = productService.getProductBySlug(decodedSlug);
        return ResponseBuilder.success("Product retrieved successfully", product);
    }

    @GetMapping("/seller/{userId}")
    public ResponseEntity<APIResponse<ProductResponse>> getProductsBySeller(
            @PathVariable Long userId,
            PaginationRequest paginationRequest,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "minRating", required = false) Double minRating,
            @RequestParam(name = "inStock", required = false) Boolean inStock) {
        ProductResponse productResponse = productService.getAllPublicProductsBySeller(
                userId,
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                category,
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder(),
                minPrice,
                maxPrice,
                minRating,
                inStock);
        return ResponseBuilder.success("Products retrieved successfully", productResponse);
    }

    @PostMapping("/batch")
    public ResponseEntity<APIResponse<List<ProductRowDTO>>> getProductsByIds(
            @RequestBody @Valid BatchProductRequest request) {
        List<ProductRowDTO> products = productService.getProductsByIds(request.getProductIds());
        return ResponseBuilder.success("Products retrieved successfully", products);
    }
}
