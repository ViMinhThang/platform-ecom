package com.ecom.product.service;

import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.CategoryResponse;
import com.ecom.product.entity.Category;
import com.ecom.product.exceptions.APIException;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private static final String ASCENDING_ORDER = "asc";

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        validateCategoryNameDoesNotExist(categoryDTO.getName());
        
        Category category = modelMapper.map(categoryDTO, Category.class);
        Category savedCategory = categoryRepository.save(category);
        
        return mapToCategoryDTO(savedCategory);
    }

    @Override
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortOrder);
        Page<Category> categoryPage = categoryRepository.findAll(pageable);
        
        List<CategoryDTO> categoryDTOs = mapToCategoryDTOs(categoryPage.getContent());
        
        return buildCategoryResponse(categoryPage, categoryDTOs);
    }

    @Override
    public CategoryDTO getCategoryById(Long categoryId) {
        Category category = findCategoryById(categoryId);
        return mapToCategoryDTO(category);
    }

    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {
        Category category = findCategoryById(categoryId);
        
        category.setName(categoryDTO.getName());
        Category updatedCategory = categoryRepository.save(category);
        
        return mapToCategoryDTO(updatedCategory);
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {
        Category category = findCategoryById(categoryId);
        
        categoryRepository.delete(category);
        
        return mapToCategoryDTO(category);
    }

    @Override
    public String updateCategoryImage(Long categoryId, MultipartFile image) {
        Category category = findCategoryById(categoryId);
        
        deleteOldImageIfExists(category);
        
        String imageUrl = fileStorageService.storeFile(image);
        category.setImageUrl(imageUrl);
        categoryRepository.save(category);
        
        return imageUrl;
    }

    // ==================== Private Helper Methods ====================

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

    private Pageable createPageable(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = ASCENDING_ORDER.equalsIgnoreCase(sortOrder)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return PageRequest.of(pageNumber, pageSize, sort);
    }

    private CategoryDTO mapToCategoryDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }

    private List<CategoryDTO> mapToCategoryDTOs(List<Category> categories) {
        return categories.stream()
                .map(this::mapToCategoryDTO)
                .collect(Collectors.toList());
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
