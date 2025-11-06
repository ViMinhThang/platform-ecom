package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.service.VariantOptionValueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variant-option-values")
public class VariantOptionValueController {

    @Autowired
    private VariantOptionValueService variantOptionValueService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<VariantOptionValueDTO> createVariantOptionValue(@Valid @RequestBody VariantOptionValueDTO variantOptionValueDTO) {
        VariantOptionValueDTO createdValue = variantOptionValueService.createVariantOptionValue(variantOptionValueDTO);
        return new ResponseEntity<>(createdValue, HttpStatus.CREATED);
    }

    @GetMapping("/variant/{variantId}")
    public ResponseEntity<List<VariantOptionValueDTO>> getValuesForVariant(@PathVariable Long variantId) {
        List<VariantOptionValueDTO> values = variantOptionValueService.getValuesForVariant(variantId);
        return new ResponseEntity<>(values, HttpStatus.OK);
    }

    @DeleteMapping("/{variantOptionValueId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<Void> deleteVariantOptionValue(@PathVariable Long variantOptionValueId) {
        variantOptionValueService.deleteVariantOptionValue(variantOptionValueId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
