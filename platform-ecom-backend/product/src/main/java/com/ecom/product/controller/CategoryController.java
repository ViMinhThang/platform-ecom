package com.ecom.product.controller;

import com.ecom.common.util.PaginationRequest;
import com.ecom.common.aspect.RequireRole;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.CategoryResponse;
import com.ecom.product.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategoryDTO = categoryService.createCategory(categoryDTO);
        return ResponseBuilder.createdWithMessage("Category created successfully", savedCategoryDTO);
    }

    @GetMapping("/public")
    public ResponseEntity<CategoryResponse> getAllCategories(PaginationRequest paginationRequest) {
        CategoryResponse categoryResponse = categoryService.getAllCategories(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    @GetMapping("/public/{categoryId}")
    public ResponseEntity<APIResponse<CategoryDTO>> getCategoryById(@PathVariable Long categoryId) {
        CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
        return ResponseBuilder.success("Category retrieved successfully", categoryDTO);
    }

    @PutMapping("/{categoryId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<CategoryDTO>> updateCategory(@Valid @RequestBody CategoryDTO categoryDTO,
            @PathVariable Long categoryId) {
        CategoryDTO updatedCategory = categoryService.updateCategory(categoryDTO, categoryId);
        return ResponseBuilder.success("Category updated successfully", updatedCategory);
    }

    @PutMapping("/{categoryId}/image")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> uploadCategoryImage(@PathVariable Long categoryId,
            @RequestParam("file") MultipartFile image) {
        String updatedImage = categoryService.updateCategoryImage(categoryId, image);
        return ResponseBuilder.success("Category image updated successfully", updatedImage);
    }

    @DeleteMapping("/{categoryId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteCategory(@PathVariable Long categoryId) {
        CategoryDTO deletedCategory = categoryService.deleteCategory(categoryId);
        return ResponseBuilder.success("Category deleted successfully", String.valueOf(deletedCategory.getId()));
    }
}
