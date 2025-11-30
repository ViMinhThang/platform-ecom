package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.dto.APIResponse;
import com.ecom.product.dto.ProductOptionDTO;
import com.ecom.product.service.ProductOptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductOptionController {

    @Autowired
    private ProductOptionService productOptionService;

    @PostMapping("seller/product-options/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductOptionDTO>> createProductOption(
            @Valid @RequestBody ProductOptionDTO productOptionDTO, @PathVariable Long productId) {
        ProductOptionDTO createdOption = productOptionService.createProductOption(productOptionDTO, productId);
        APIResponse<ProductOptionDTO> response = new APIResponse<>(
                "Product option created successfully",
                true,
                createdOption);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("seller/{productId}/options")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<List<ProductOptionDTO>>> getListProductOptionByProductId(
            @PathVariable Long productId) {
        List<ProductOptionDTO> options = productOptionService.getProductOptionById(productId);
        APIResponse<List<ProductOptionDTO>> response = new APIResponse<>(
                "Product options retrieved successfully",
                true,
                options);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/seller/product-options/{productId}/{optionId}")
    public ResponseEntity<APIResponse<ProductOptionDTO>> updateOption(
            @PathVariable Long productId,
            @PathVariable Long optionId,
            @RequestBody ProductOptionDTO dto) {
        ProductOptionDTO updated = productOptionService.updateProductOption(dto, productId, optionId);
        APIResponse<ProductOptionDTO> response = new APIResponse<>(
                "Product option updated successfully",
                true,
                updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("seller/product-options/{productId}/{optionId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProductOption(@PathVariable Long optionId,
            @PathVariable Long productId) {
        productOptionService.deleteProductOption(optionId, productId);
        APIResponse<String> response = new APIResponse<>(
                "Product option deleted successfully",
                true,
                String.valueOf(optionId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
