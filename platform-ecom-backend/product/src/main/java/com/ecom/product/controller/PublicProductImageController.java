package com.ecom.product.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.ProductImageDTO;
import com.ecom.product.service.signature.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/{productId}/images")
@RequiredArgsConstructor
public class PublicProductImageController {

    private final ProductImageService productImageService;

    @GetMapping
    public ResponseEntity<APIResponse<List<ProductImageDTO>>> getProductImages(@PathVariable Long productId) {
        List<ProductImageDTO> images = productImageService.getProductImages(productId);
        return ResponseBuilder.success("Images retrieved successfully", images);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<APIResponse<ProductImageDTO>> getProductImageById(@PathVariable Long productId,
            @PathVariable Long imageId) {
        ProductImageDTO image = productImageService.getProductImageById(productId, imageId);
        return ResponseBuilder.success("Image retrieved successfully", image);
    }
}
