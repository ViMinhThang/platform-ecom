package com.ecom.product.helper;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.Category;
import com.ecom.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryHelper {

    private final CategoryRepository categoryRepository;

    public Category findByIdOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "Id", id));
    }

    public Category findBySlugOrThrow(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
    }

    public void validateCategoryNameDoesNotExist(String name) {
        Category existingCategory = categoryRepository.findByName(name);
        if (existingCategory != null) {
            throw new APIException("Category with the name " + name + " already exists!");
        }
    }
}
