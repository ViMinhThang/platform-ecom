package com.ecom.product.controller.Seller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.CategoryResponse;
import com.ecom.product.service.signature.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for seller-level category access (READ-ONLY)
 * Sellers can view categories to assign products
 * All write operations are restricted to admins only
 * Base path: /api/v1/sellers/categories
 */
@RestController
@RequestMapping("/api/v1/sellers/categories")
@RequiredArgsConstructor
public class SellerCategoryController {

    private final CategoryService categoryService;

    /**
     * GET /api/v1/sellers/categories
     * Seller endpoint to get all categories (read-only)
     */
    @GetMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<CategoryResponse>> getAllCategories(PaginationRequest paginationRequest) {
        CategoryResponse categoryResponse = categoryService.getAllCategories(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("Categories retrieved successfully", categoryResponse);
    }

    /**
     * GET /api/v1/sellers/categories/{id}
     * Seller endpoint to get specific category by ID (read-only)
     */
    @GetMapping("/{categoryId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<CategoryDTO>> getCategoryById(@PathVariable Long categoryId) {
        CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
        return ResponseBuilder.success("Category retrieved successfully", categoryDTO);
    }
}