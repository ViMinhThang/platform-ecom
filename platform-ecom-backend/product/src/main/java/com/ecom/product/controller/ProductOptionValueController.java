package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.service.ProductOptionValueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-option-values")
public class ProductOptionValueController {

    @Autowired
    private ProductOptionValueService productOptionValueService;

    @PostMapping
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<ProductOptionValueDTO> createProductOptionValue(@Valid @RequestBody ProductOptionValueDTO productOptionValueDTO) {
        ProductOptionValueDTO createdValue = productOptionValueService.createProductOptionValue(productOptionValueDTO);
        return new ResponseEntity<>(createdValue, HttpStatus.CREATED);
    }

    @GetMapping("/option/{optionId}")
    public ResponseEntity<List<ProductOptionValueDTO>> getValuesForOption(@PathVariable Long optionId) {
        List<ProductOptionValueDTO> values = productOptionValueService.getValuesForOption(optionId);
        return new ResponseEntity<>(values, HttpStatus.OK);
    }

    @GetMapping("/{valueId}")
    public ResponseEntity<ProductOptionValueDTO> getProductOptionValueById(@PathVariable Long valueId) {
        ProductOptionValueDTO value = productOptionValueService.getProductOptionValueById(valueId);
        return new ResponseEntity<>(value, HttpStatus.OK);
    }

    @PutMapping("/{valueId}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<ProductOptionValueDTO> updateProductOptionValue(@PathVariable Long valueId, @Valid @RequestBody ProductOptionValueDTO productOptionValueDTO) {
        ProductOptionValueDTO updatedValue = productOptionValueService.updateProductOptionValue(valueId, productOptionValueDTO);
        return new ResponseEntity<>(updatedValue, HttpStatus.OK);
    }

    @DeleteMapping("/{valueId}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<Void> deleteProductOptionValue(@PathVariable Long valueId) {
        productOptionValueService.deleteProductOptionValue(valueId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
