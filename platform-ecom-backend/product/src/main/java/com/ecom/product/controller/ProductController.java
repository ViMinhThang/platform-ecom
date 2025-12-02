package com.ecom.product.controller;

import com.ecom.common.aspect.RequireRole;

import com.ecom.common.security.AuthContext;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.APIResponse;
import com.ecom.product.dto.*;
import com.ecom.product.service.ProductService;
import com.ecom.common.util.ResponseBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@Slf4j
@RequiredArgsConstructor
public class ProductController {

        private final ProductService productService;
        private final AuthContext authContext;

        @GetMapping("/seller")
        @RequireRole("ROLE_SELLER")
        public ResponseEntity<ProductResponse> getSellerProducts(
                        PaginationRequest paginationRequest,
                        @RequestParam(name = "name", required = false) String name,
                        @RequestParam(name = "category", required = false) String category,
                        HttpServletRequest request) {
                Long userId = authContext.getUserId(request);
                ProductResponse productResponse = productService.getAllProductsForSeller(
                                paginationRequest.getPageNumber(),
                                paginationRequest.getPageSize(),
                                name,
                                category,
                                paginationRequest.getSortBy(),
                                paginationRequest.getSortOrder(),
                                userId);
                return new ResponseEntity<>(productResponse, HttpStatus.OK);
        }

        @PostMapping("/seller")
        @RequireRole("ROLE_SELLER")
        public ResponseEntity<APIResponse<ProductRowDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO,
                        HttpServletRequest request) {
                Long userId = authContext.getUserId(request);
                ProductRowDTO savedProduct = productService.createProduct(productDTO, userId);
                return ResponseBuilder.createdWithMessage("Product created successfully", savedProduct);
        }

        @PutMapping("seller/{productId}")
        @RequireRole("ROLE_SELLER")
        public ResponseEntity<APIResponse<ProductDTO>> updateProduct(@PathVariable Long productId,
                        @Valid @RequestBody ProductDTO productDTO) {
                ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
                return ResponseBuilder.success("Product updated successfully", updatedProduct);
        }

        @DeleteMapping("seller/{productId}")
        @RequireRole("ROLE_SELLER")
        public ResponseEntity<APIResponse<String>> deleteProduct(@PathVariable Long productId) {
                ProductDTO deletedProduct = productService.deleteProduct(productId);
                return ResponseBuilder.success("Product deleted successfully", String.valueOf(deletedProduct.getId()));
        }

        @GetMapping("seller/{productId}")
        @RequireRole("ROLE_SELLER")
        public ResponseEntity<APIResponse<ProductDTO>> getProductById(@PathVariable Long productId) {
                ProductDTO productDTO = productService.getProductById(productId);
                return ResponseBuilder.success("Product retrieved successfully", productDTO);
        }

        // Public endpoints for anonymous users
        @GetMapping("/public")
        public ResponseEntity<ProductResponse> getPublicProducts(
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
                return new ResponseEntity<>(productResponse, HttpStatus.OK);
        }

        @GetMapping("/public/{productId}")
        public ResponseEntity<APIResponse<ProductDTO>> getPublicProductById(@PathVariable Long productId) {
                ProductDTO productDTO = productService.getPublicProductById(productId);
                return ResponseBuilder.success("Product retrieved successfully", productDTO);
        }

        @GetMapping("/public/{productId}/with-variants")
        public ResponseEntity<APIResponse<ProductDetailDTO>> getPublicProductWithVariants(
                        @PathVariable Long productId) {
                ProductDetailDTO productDetailDTO = productService.getProductWithVariants(productId);
                return ResponseBuilder.success("Product details retrieved successfully", productDetailDTO);
        }

        @GetMapping("/public/variants/{variantId}")
        public ResponseEntity<APIResponse<ProductVariantDTO>> getVariantById(@PathVariable Long variantId) {
                ProductVariantDTO variantDTO = productService.getVariantById(variantId);
                return ResponseBuilder.success("Variant retrieved successfully", variantDTO);
        }

}
