package com.ecom.product.controller;

import com.ecom.product.aspect.RequireRole;
import com.ecom.product.config.AppConstants;
import com.ecom.product.dto.APIResponse;
import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.CategoryResponse;
import com.ecom.product.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategoryDTO = categoryService.createCategory(categoryDTO);
        APIResponse<CategoryDTO> response = new APIResponse<>(
                "Category created successfully",
                true,
                savedCategoryDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/public")
    public ResponseEntity<CategoryResponse> getAllCategories(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_CATEGORIES_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        CategoryResponse categoryResponse = categoryService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    @GetMapping("/public/{categoryId}")
    public ResponseEntity<APIResponse<CategoryDTO>> getCategoryById(@PathVariable Long categoryId) {
        CategoryDTO categoryDTO = categoryService.getCategoryById(categoryId);
        APIResponse<CategoryDTO> response = new APIResponse<>(
                "Category retrieved successfully",
                true,
                categoryDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{categoryId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<CategoryDTO>> updateCategory(@Valid @RequestBody CategoryDTO categoryDTO,
            @PathVariable Long categoryId) {
        CategoryDTO updatedCategory = categoryService.updateCategory(categoryDTO, categoryId);
        APIResponse<CategoryDTO> response = new APIResponse<>(
                "Category updated successfully",
                true,
                updatedCategory);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{categoryId}/image")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> uploadCategoryImage(@PathVariable Long categoryId,
            @RequestParam("file") MultipartFile image) {
        String updatedImage = categoryService.updateCategoryImage(categoryId, image);
        APIResponse<String> response = new APIResponse<>(
                "Category image updated successfully",
                true,
                updatedImage);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{categoryId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<String>> deleteCategory(@PathVariable Long categoryId) {
        CategoryDTO deletedCategory = categoryService.deleteCategory(categoryId);
        APIResponse<String> response = new APIResponse<>(
                "Category deleted successfully",
                true,
                String.valueOf(deletedCategory.getId()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
