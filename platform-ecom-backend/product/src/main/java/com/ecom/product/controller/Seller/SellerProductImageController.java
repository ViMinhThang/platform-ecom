package com.ecom.product.controller.Seller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.ProductImageDTO;
import com.ecom.product.service.signature.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sellers/products/{productId}/images")
@RequiredArgsConstructor
public class SellerProductImageController {

    private final ProductImageService productImageService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductImageDTO>> addImageToProduct(@PathVariable Long productId,
            @RequestParam("image") MultipartFile image) {
        ProductImageDTO savedImage = productImageService.addImageToProduct(productId, image);
        return ResponseBuilder.createdWithMessage("Image added successfully", savedImage);
    }

    @PutMapping("/{imageId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductImageDTO>> updateProductImage(@PathVariable Long productId,
            @PathVariable Long imageId,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        ProductImageDTO updatedImage = productImageService.updateProductImage(productId, imageId, imageFile);
        return ResponseBuilder.success("Image updated successfully", updatedImage);
    }

    @DeleteMapping("/{imageId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProductImage(@PathVariable Long productId,
            @PathVariable Long imageId) {
        productImageService.deleteProductImage(productId, imageId);
        return ResponseBuilder.deleted("Image deleted successfully", null);
    }

    @GetMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<List<ProductImageDTO>>> getProductImages(
            @PathVariable Long productId) {
        List<ProductImageDTO> images = productImageService.getProductImages(productId);
        return ResponseBuilder.success("Images retrieved successfully", images);
    }
}
