package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.dto.ProductImageDTO;
import com.ecom.product.service.ProductImageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/images")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductImageDTO> addImageToProduct(@PathVariable Long productId, @Valid @RequestBody ProductImageDTO productImageDTO) {
        ProductImageDTO savedImage = productImageService.addImageToProduct(productId, productImageDTO);
        return new ResponseEntity<>(savedImage, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductImageDTO>> getProductImages(@PathVariable Long productId) {
        List<ProductImageDTO> images = productImageService.getProductImages(productId);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<ProductImageDTO> getProductImageById(@PathVariable Long productId, @PathVariable Long imageId) {
        ProductImageDTO image = productImageService.getProductImageById(productId, imageId);
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @PutMapping("/{imageId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<ProductImageDTO> updateProductImage(@PathVariable Long productId, @PathVariable Long imageId, @Valid @RequestBody ProductImageDTO productImageDTO) {
        ProductImageDTO updatedImage = productImageService.updateProductImage(productId, imageId, productImageDTO);
        return new ResponseEntity<>(updatedImage, HttpStatus.OK);
    }

    @DeleteMapping("/{imageId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productImageService.deleteProductImage(productId, imageId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
