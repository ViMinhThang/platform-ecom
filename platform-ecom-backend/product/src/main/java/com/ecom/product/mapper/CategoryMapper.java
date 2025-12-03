package com.ecom.product.mapper;

import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.entity.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Dedicated mapper class for Category entity to DTO conversions.
 */
@Component
public class CategoryMapper {

    /**
     * Maps Category entity to CategoryDTO
     */
    public CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }

        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setImageUrl(category.getImageUrl());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());

        return dto;
    }

    /**
     * Maps list of categories to list of CategoryDTOs
     */
    public List<CategoryDTO> toDTOs(List<Category> categories) {
        if (categories == null) {
            return List.of();
        }

        return categories.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
