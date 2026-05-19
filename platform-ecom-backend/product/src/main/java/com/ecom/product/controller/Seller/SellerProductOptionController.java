package com.ecom.product.controller.Seller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.ProductOptionDTO;
import com.ecom.product.service.signature.ProductOptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sellers/products/{productId}/options")
@RequiredArgsConstructor
public class SellerProductOptionController {

    private final ProductOptionService productOptionService;

    @PostMapping()
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductOptionDTO>> createProductOption(
            @Valid @RequestBody ProductOptionDTO productOptionDTO, @PathVariable Long productId) {
        ProductOptionDTO createdOption = productOptionService.createProductOption(productOptionDTO, productId);
        return ResponseBuilder.createdWithMessage("Product option created successfully", createdOption);
    }

    @GetMapping()
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<List<ProductOptionDTO>>> getListProductOptionByProductId(
            @PathVariable Long productId) {
        List<ProductOptionDTO> options = productOptionService.getProductOptionById(productId);
        return ResponseBuilder.success("Product options retrieved successfully", options);
    }

    @PutMapping("/{optionId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductOptionDTO>> updateOption(
            @PathVariable Long productId,
            @PathVariable Long optionId,
            @RequestBody ProductOptionDTO dto) {
        ProductOptionDTO updated = productOptionService.updateProductOption(dto, productId, optionId);
        return ResponseBuilder.success("Product option updated successfully", updated);
    }

    @DeleteMapping("/{optionId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProductOption(@PathVariable Long optionId,
            @PathVariable Long productId) {
        productOptionService.deleteProductOption(optionId, productId);
        return ResponseBuilder.success("Product option deleted successfully", String.valueOf(optionId));
    }
}
