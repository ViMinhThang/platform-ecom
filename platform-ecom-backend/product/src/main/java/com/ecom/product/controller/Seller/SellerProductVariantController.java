package com.ecom.product.controller.Seller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.service.signature.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sellers/products/{productId}/variants")
@RequiredArgsConstructor
public class SellerProductVariantController {

    private final ProductVariantService productVariantService;

    @PostMapping()
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductVariantDTO>> createProductVariant(@PathVariable Long productId,
            @Valid @RequestBody ProductVariantDTO productVariantDTO) {
        ProductVariantDTO createdVariant = productVariantService.createProductVariant(productId,
                productVariantDTO);
        return ResponseBuilder.createdWithMessage("Variant created successfully", createdVariant);
    }

    @GetMapping()
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<List<ProductVariantDTO>>> getVariantsForProduct(
            @PathVariable Long productId,
            @RequestParam(required = false) Boolean hidden) {
        List<ProductVariantDTO> variants = productVariantService.getVariantsForProduct(productId, hidden);
        return ResponseBuilder.success("Variants retrieved successfully", variants);
    }

    @GetMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    ResponseEntity<APIResponse<ProductVariantDTO>> getVariantById(@PathVariable Long variantId) {
        ProductVariantDTO variantDTO = productVariantService.findVariantById(variantId);
        return ResponseBuilder.success("Variant retrieved successfully", variantDTO);
    }

    @PutMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductVariantDTO>> updateProductVariant(@PathVariable Long productId,
            @PathVariable Long variantId, @Valid @RequestBody ProductVariantDTO productVariantDTO) {
        ProductVariantDTO updatedVariant = productVariantService.updateProductVariant(productId, variantId,
                productVariantDTO);
        return ResponseBuilder.success("Variant updated successfully", updatedVariant);
    }

    @PatchMapping("/{variantId}/visibility")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductVariantDTO>> toggleVariantVisibility(
            @PathVariable Long productId,
            @PathVariable Long variantId) {
        ProductVariantDTO variant = productVariantService.toggleVariantVisibility(productId, variantId);
        return ResponseBuilder.success("Variant visibility toggled", variant);
    }

    @DeleteMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProductVariant(@PathVariable Long productId,
            @PathVariable Long variantId) {
        productVariantService.deleteProductVariant(productId, variantId);
        return ResponseBuilder.success("Variant deleted successfully", String.valueOf(variantId));
    }
}
