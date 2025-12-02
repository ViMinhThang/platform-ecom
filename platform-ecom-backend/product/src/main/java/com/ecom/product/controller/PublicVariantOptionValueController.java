package com.ecom.product.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.service.signature.VariantOptionValueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/variants/{variantId}/values")
@RequiredArgsConstructor
public class PublicVariantOptionValueController {

    private final VariantOptionValueService variantOptionValueService;

    @GetMapping
    public ResponseEntity<APIResponse<List<VariantOptionValueDTO>>> getValuesForVariant(@PathVariable Long variantId) {
        List<VariantOptionValueDTO> values = variantOptionValueService.getValuesForVariant(variantId);
        return ResponseBuilder.success("Variant option values retrieved successfully", values);
    }
}
