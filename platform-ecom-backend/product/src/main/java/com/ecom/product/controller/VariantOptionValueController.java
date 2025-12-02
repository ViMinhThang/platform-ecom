package com.ecom.product.controller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.service.VariantOptionValueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variant-option-values")
@RequiredArgsConstructor
public class VariantOptionValueController {

    private final VariantOptionValueService variantOptionValueService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<VariantOptionValueDTO>> createVariantOptionValue(
            @Valid @RequestBody VariantOptionValueDTO variantOptionValueDTO) {
        VariantOptionValueDTO createdValue = variantOptionValueService.createVariantOptionValue(variantOptionValueDTO);
        return ResponseBuilder.createdWithMessage("Variant option value created successfully", createdValue);
    }

    @GetMapping("/variant/{variantId}")
    public ResponseEntity<APIResponse<List<VariantOptionValueDTO>>> getValuesForVariant(@PathVariable Long variantId) {
        List<VariantOptionValueDTO> values = variantOptionValueService.getValuesForVariant(variantId);
        return ResponseBuilder.success("Variant option values retrieved successfully", values);
    }

    @DeleteMapping("/{variantOptionValueId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<Void>> deleteVariantOptionValue(@PathVariable Long variantOptionValueId) {
        variantOptionValueService.deleteVariantOptionValue(variantOptionValueId);
        return ResponseBuilder.deleted("Variant option value deleted successfully", null);
    }
}
