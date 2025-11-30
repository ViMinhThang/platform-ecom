package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.config.AppConstants;
import com.ecom.product.config.AuthContext;
import com.ecom.product.dto.*;
import com.ecom.product.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@Slf4j
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuthContext authContext;

    @GetMapping("/seller")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductResponse> getSellerProducts(
            @RequestParam(name = "page", defaultValue = "0", required = false) Integer page,
            @RequestParam(name = "perPage", defaultValue = "10", required = false) Integer perPage,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = "desc", required = false) String sortOrder,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        ProductResponse productResponse = productService.getAllProductsForSeller(page, perPage, name, category, sortBy,
                sortOrder, userId);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    @PostMapping("/seller")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductRowDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        ProductRowDTO savedProduct = productService.createProduct(productDTO, userId);
        APIResponse<ProductRowDTO> response = new APIResponse<>(
                "Product created successfully",
                true,
                savedProduct);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("seller/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductDTO>> updateProduct(@PathVariable Long productId,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
        APIResponse<ProductDTO> response = new APIResponse<>(
                "Product updated successfully",
                true,
                updatedProduct);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("seller/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProduct(@PathVariable Long productId) {
        ProductDTO deletedProduct = productService.deleteProduct(productId);
        APIResponse<String> response = new APIResponse<>(
                "Product deleted successfully",
                true,
                String.valueOf(deletedProduct.getId()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("seller/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductDTO>> getProductById(@PathVariable Long productId) {
        ProductDTO productDTO = productService.getProductById(productId);
        APIResponse<ProductDTO> response = new APIResponse<>(
                "Product retrieved successfully",
                true,
                productDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Public endpoints for anonymous users
    @GetMapping("/public")
    public ResponseEntity<ProductResponse> getPublicProducts(
            @RequestParam(name = "page", defaultValue = "0", required = false) Integer page,
            @RequestParam(name = "perPage", defaultValue = "12", required = false) Integer perPage,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = "desc", required = false) String sortOrder) {
        ProductResponse productResponse = productService.getAllPublicProducts(page, perPage, category, search, sortBy,
                sortOrder);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/{productId}")
    public ResponseEntity<APIResponse<ProductDTO>> getPublicProductById(@PathVariable Long productId) {
        ProductDTO productDTO = productService.getPublicProductById(productId);
        APIResponse<ProductDTO> response = new APIResponse<>(
                "Product retrieved successfully",
                true,
                productDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/public/{productId}/with-variants")
    public ResponseEntity<APIResponse<ProductDetailDTO>> getPublicProductWithVariants(@PathVariable Long productId) {
        ProductDetailDTO productDetailDTO = productService.getProductWithVariants(productId);
        APIResponse<ProductDetailDTO> response = new APIResponse<>(
                "Product details retrieved successfully",
                true,
                productDetailDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
