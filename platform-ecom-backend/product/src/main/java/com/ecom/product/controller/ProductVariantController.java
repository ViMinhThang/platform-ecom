package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
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
    public ResponseEntity<ProductVariantDTO> createProductVariant(@PathVariable Long productId, @Valid @RequestBody ProductVariantDTO productVariantDTO) {
        ProductVariantDTO createdVariant = productVariantService.createProductVariant(productId, productVariantDTO);
        return new ResponseEntity<>(createdVariant, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductVariantDTO>> getVariantsForProduct(@PathVariable Long productId) {
        List<ProductVariantDTO> variants = productVariantService.getVariantsForProduct(productId);
        return new ResponseEntity<>(variants, HttpStatus.OK);
    }

    @GetMapping("/{variantId}")
    public ResponseEntity<ProductVariantDTO> getProductVariantById(@PathVariable Long productId, @PathVariable Long variantId) {
        ProductVariantDTO variant = productVariantService.getProductVariantById(productId, variantId);
        return new ResponseEntity<>(variant, HttpStatus.OK);
    }

    @PutMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductVariantDTO> updateProductVariant(@PathVariable Long productId, @PathVariable Long variantId, @Valid @RequestBody ProductVariantDTO productVariantDTO) {
        ProductVariantDTO updatedVariant = productVariantService.updateProductVariant(productId, variantId, productVariantDTO);
        return new ResponseEntity<>(updatedVariant, HttpStatus.OK);
    }

    @DeleteMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<Void> deleteProductVariant(@PathVariable Long productId, @PathVariable Long variantId) {
        productVariantService.deleteProductVariant(productId, variantId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
