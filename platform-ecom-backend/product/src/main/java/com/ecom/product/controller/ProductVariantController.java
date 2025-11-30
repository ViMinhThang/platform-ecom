package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.dto.APIResponse;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.service.ProductVariantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/seller/{productId}/variants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService productVariantService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductVariantDTO>> createProductVariant(@PathVariable Long productId,
            @Valid @RequestBody ProductVariantDTO productVariantDTO) {
        ProductVariantDTO createdVariant = productVariantService.createProductVariant(productId, productVariantDTO);
        APIResponse<ProductVariantDTO> response = new APIResponse<>(
                "Variant created successfully",
                true,
                createdVariant);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<ProductVariantDTO>>> getVariantsForProduct(@PathVariable Long productId) {
        List<ProductVariantDTO> variants = productVariantService.getVariantsForProduct(productId);
        APIResponse<List<ProductVariantDTO>> response = new APIResponse<>(
                "Variants retrieved successfully",
                true,
                variants);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("{variantId}")
    ResponseEntity<APIResponse<ProductVariantDTO>> getVariantById(@PathVariable Long variantId) {
        ProductVariantDTO variantDTO = productVariantService.findVariantById(variantId);
        APIResponse<ProductVariantDTO> response = new APIResponse<>(
                "Variant retrieved successfully",
                true,
                variantDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductVariantDTO>> updateProductVariant(@PathVariable Long productId,
            @PathVariable Long variantId, @Valid @RequestBody ProductVariantDTO productVariantDTO) {
        ProductVariantDTO updatedVariant = productVariantService.updateProductVariant(productId, variantId,
                productVariantDTO);
        APIResponse<ProductVariantDTO> response = new APIResponse<>(
                "Variant updated successfully",
                true,
                updatedVariant);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProductVariant(@PathVariable Long productId,
            @PathVariable Long variantId) {
        productVariantService.deleteProductVariant(productId, variantId);
        APIResponse<String> response = new APIResponse<>(
                "Variant deleted successfully",
                true,
                String.valueOf(variantId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
