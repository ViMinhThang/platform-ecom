package com.ecom.product.controller.Admin;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.response.CategoryResponse;
import com.ecom.product.service.signature.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;


    @GetMapping
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<CategoryResponse>> getAllCategories(PaginationRequest paginationRequest) {
        CategoryResponse categoryResponse = categoryService.getAllCategories(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("Categories retrieved successfully", categoryResponse);
    }


    @GetMapping("/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<CategoryDTO>> getCategoryById(@PathVariable("id") Long categoryId) {
        CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
        return ResponseBuilder.success("Category retrieved successfully", categoryDTO);
    }


    @PostMapping
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategory = categoryService.createCategory(categoryDTO);
        return ResponseBuilder.createdWithMessage("Category created successfully", savedCategory);
    }

    /**
     * PUT /api/v1/admin/categories/{id}
     * Admin endpoint to update category
     */
    @PutMapping("/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<CategoryDTO>> updateCategory(
            @PathVariable("id") Long categoryId,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO updatedCategory = categoryService.updateCategory(categoryDTO, categoryId);
        return ResponseBuilder.success("Category updated successfully", updatedCategory);
    }

    /**
     * PUT /api/v1/admin/categories/{id}/image
     * Admin endpoint to update category image
     */
    @PutMapping("/{id}/image")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<String>> uploadCategoryImage(
            @PathVariable("id") Long categoryId,
            @RequestParam("file") MultipartFile image) {
        String imageUrl = categoryService.updateCategoryImage(categoryId, image);
        return ResponseBuilder.success("Category image updated successfully", imageUrl);
    }

    /**
     * DELETE /api/v1/admin/categories/{id}
     * Admin endpoint to delete category
     */
    @DeleteMapping("/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<String>> deleteCategory(@PathVariable("id") Long categoryId) {
        CategoryDTO deletedCategory = categoryService.deleteCategory(categoryId);
        return ResponseBuilder.success("Category deleted successfully", String.valueOf(deletedCategory.getId()));
    }
}
