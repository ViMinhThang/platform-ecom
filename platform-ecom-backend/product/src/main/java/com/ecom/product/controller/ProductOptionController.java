package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
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
    public ResponseEntity<ProductOptionDTO> createProductOption(@Valid @RequestBody ProductOptionDTO productOptionDTO ,@PathVariable Long productId) {
        ProductOptionDTO createdOption = productOptionService.createProductOption(productOptionDTO,productId);
        return new ResponseEntity<>(createdOption, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductOptionDTO>> getAllProductOptions() {
        List<ProductOptionDTO> options = productOptionService.getAllProductOptions();
        return new ResponseEntity<>(options, HttpStatus.OK);
    }


    @GetMapping("seller/{productId}/options")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<List<ProductOptionDTO>>getListProductOptionByProductId(@PathVariable Long productId){
        List<ProductOptionDTO> options = productOptionService.getProductOptionById(productId);
        return new ResponseEntity<>(options,HttpStatus.OK);
    }

    @PutMapping("/seller/product-options/{productId}/{optionId}")
    public ResponseEntity<ProductOptionDTO> updateOption(
            @PathVariable Long productId,
            @PathVariable Long optionId,
            @RequestBody ProductOptionDTO dto) {
        ProductOptionDTO updated = productOptionService.updateProductOption(dto, productId, optionId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("seller/product-options/{productId}/{optionId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<Void> deleteProductOption(@PathVariable Long optionId,@PathVariable Long productId) {
        productOptionService.deleteProductOption(optionId,productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
