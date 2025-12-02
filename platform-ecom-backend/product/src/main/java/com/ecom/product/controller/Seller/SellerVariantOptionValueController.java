package com.ecom.product.controller.Seller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.service.signature.VariantOptionValueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sellers/products/variants/values")
@RequiredArgsConstructor
public class SellerVariantOptionValueController {

    private final VariantOptionValueService variantOptionValueService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<VariantOptionValueDTO>> createVariantOptionValue(
            @Valid @RequestBody VariantOptionValueDTO variantOptionValueDTO) {
        VariantOptionValueDTO createdValue = variantOptionValueService.createVariantOptionValue(variantOptionValueDTO);
        return ResponseBuilder.createdWithMessage("Variant option value created successfully", createdValue);
    }

    @DeleteMapping("/{variantOptionValueId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<Void>> deleteVariantOptionValue(@PathVariable Long variantOptionValueId) {
        variantOptionValueService.deleteVariantOptionValue(variantOptionValueId);
        return ResponseBuilder.deleted("Variant option value deleted successfully", null);
    }
}
