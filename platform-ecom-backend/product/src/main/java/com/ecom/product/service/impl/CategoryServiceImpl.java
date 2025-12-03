package com.ecom.product.service.impl;

import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.CategoryResponse;
import com.ecom.product.entity.Category;
import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.mapper.CategoryMapper;
import com.ecom.product.repository.CategoryRepository;
import com.ecom.common.service.FileStorageService;
import com.ecom.product.service.signature.CategoryService;
import com.ecom.product.utils.PageableUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        validateCategoryNameDoesNotExist(categoryDTO.getName());

        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setSlug(categoryDTO.getSlug()); // Allow custom slug if provided
        category.setImageUrl(categoryDTO.getImageUrl());

        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toDTO(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Pageable pageable = PageableUtils.createPageable(pageNumber, pageSize, sortBy, sortOrder);
        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryDTO> categoryDTOs = categoryMapper.toDTOs(categoryPage.getContent());

        return buildCategoryResponse(categoryPage, categoryDTOs);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long categoryId) {
        Category category = findCategoryById(categoryId);
        return categoryMapper.toDTO(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        return categoryMapper.toDTO(category);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {
        Category category = findCategoryById(categoryId);

        category.setName(categoryDTO.getName());
        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.toDTO(updatedCategory);
    }

    @Override
    @Transactional
    public CategoryDTO deleteCategory(Long categoryId) {
        Category category = findCategoryById(categoryId);
        CategoryDTO categoryDTO = categoryMapper.toDTO(category);

        categoryRepository.delete(category);

        return categoryDTO;
    }

    @Override
    @Transactional
    public String updateCategoryImage(Long categoryId, MultipartFile image) {
        Category category = findCategoryById(categoryId);

        deleteOldImageIfExists(category);

        String imageUrl = fileStorageService.storeFile(image);
        category.setImageUrl(imageUrl);
        categoryRepository.save(category);

        return imageUrl;
    }

    private Category findCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
    }

    private void validateCategoryNameDoesNotExist(String name) {
        Category existingCategory = categoryRepository.findByName(name);
        if (existingCategory != null) {
            throw new APIException("Category with the name " + name + " already exists!");
        }
    }

    private CategoryResponse buildCategoryResponse(Page<Category> categoryPage, List<CategoryDTO> categoryDTOs) {
        CategoryResponse response = new CategoryResponse();
        response.setContent(categoryDTOs);
        response.setPageNumber(categoryPage.getNumber());
        response.setPageSize(categoryPage.getSize());
        response.setTotalElements(categoryPage.getTotalElements());
        response.setTotalPages(categoryPage.getTotalPages());
        response.setLastPage(categoryPage.isLast());
        return response;
    }

    private void deleteOldImageIfExists(Category category) {
        if (category.getImageUrl() != null) {
            fileStorageService.deleteFile(category.getImageUrl());
        }
    }
}
