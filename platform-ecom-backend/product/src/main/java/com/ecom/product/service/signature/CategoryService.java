package com.ecom.product.service.signature;

import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.CategoryResponse;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {

    CategoryDTO createCategory(@Valid CategoryDTO categoryDTO);

    CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    CategoryDTO getCategoryById(Long categoryId);

    CategoryDTO updateCategory(@Valid CategoryDTO categoryDTO, Long categoryId);

    CategoryDTO deleteCategory(Long categoryId);

    String updateCategoryImage(Long categoryId, MultipartFile image);
}
