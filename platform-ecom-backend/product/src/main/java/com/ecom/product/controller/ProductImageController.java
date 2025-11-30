package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.dto.APIResponse;
import com.ecom.product.dto.ProductImageDTO;
import com.ecom.product.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/product-image/{productId}/images")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductImageDTO>> addImageToProduct(@PathVariable Long productId,
            @RequestParam("image") MultipartFile image) {
        ProductImageDTO savedImage = productImageService.addImageToProduct(productId, image);
        APIResponse<ProductImageDTO> response = new APIResponse<>(
                "Image added successfully",
                true,
                savedImage);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<ProductImageDTO>>> getProductImages(@PathVariable Long productId) {
        List<ProductImageDTO> images = productImageService.getProductImages(productId);
        APIResponse<List<ProductImageDTO>> response = new APIResponse<>(
                "Images retrieved successfully",
                true,
                images);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<APIResponse<ProductImageDTO>> getProductImageById(@PathVariable Long productId,
            @PathVariable Long imageId) {
        ProductImageDTO image = productImageService.getProductImageById(productId, imageId);
        APIResponse<ProductImageDTO> response = new APIResponse<>(
                "Image retrieved successfully",
                true,
                image);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{imageId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductImageDTO>> updateProductImage(@PathVariable Long productId,
            @PathVariable Long imageId, @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        ProductImageDTO updatedImage = productImageService.updateProductImage(productId, imageId, imageFile);
        APIResponse<ProductImageDTO> response = new APIResponse<>(
                "Image updated successfully",
                true,
                updatedImage);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{imageId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProductImage(@PathVariable Long productId,
            @PathVariable Long imageId) {
        productImageService.deleteProductImage(productId, imageId);
        APIResponse<String> response = new APIResponse<>(
                "Image deleted successfully",
                true,
                null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
