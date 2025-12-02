package com.ecom.product.controller.Seller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.ProductDTO;
import com.ecom.product.dto.ProductResponse;
import com.ecom.product.dto.ProductRowDTO;
import com.ecom.product.service.signature.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sellers/products")
@RequiredArgsConstructor
public class SellerProductController {

    private final ProductService productService;
    private final AuthContext authContext;

    @GetMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductResponse>> getSellerProducts(
            PaginationRequest paginationRequest,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "category", required = false) String category,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        ProductResponse productResponse = productService.getAllProductsForSeller(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                name,
                category,
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder(),
                userId);
        return ResponseBuilder.success("Products retrieved successfully", productResponse);
    }

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductRowDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        ProductRowDTO savedProduct = productService.createProduct(productDTO, userId);
        return ResponseBuilder.createdWithMessage("Product created successfully", savedProduct);
    }

    @PutMapping("/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductDTO>> updateProduct(@PathVariable Long productId,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
        return ResponseBuilder.success("Product updated successfully", updatedProduct);
    }

    @DeleteMapping("/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteProduct(@PathVariable Long productId) {
        ProductDTO deletedProduct = productService.deleteProduct(productId);
        return ResponseBuilder.success("Product deleted successfully", String.valueOf(deletedProduct.getId()));
    }

    @GetMapping("/{productId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<ProductDTO>> getProductById(@PathVariable Long productId) {
        ProductDTO productDTO = productService.getProductById(productId);
        return ResponseBuilder.success("Product retrieved successfully", productDTO);
    }
}
