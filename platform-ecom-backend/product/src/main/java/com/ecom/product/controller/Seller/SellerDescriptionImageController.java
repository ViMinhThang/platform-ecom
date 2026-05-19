package com.ecom.product.controller.Seller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.DescriptionImageDTO;
import com.ecom.product.service.signature.DescriptionImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/sellers/products/{productId}/description-images")
@RequiredArgsConstructor
public class SellerDescriptionImageController {

    private final DescriptionImageService descriptionImageService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<DescriptionImageDTO>> uploadImage(
            @PathVariable Long productId,
            @RequestParam("image") MultipartFile image) {
        DescriptionImageDTO uploadedImage = descriptionImageService.uploadImage(productId, image);
        return ResponseBuilder.createdWithMessage("Image uploaded successfully", uploadedImage);
    }

    @DeleteMapping("/{imageId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> markAsDeleted(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        descriptionImageService.markAsDeleted(productId, imageId);
        return ResponseBuilder.success("Image marked for deletion", null);
    }
}
