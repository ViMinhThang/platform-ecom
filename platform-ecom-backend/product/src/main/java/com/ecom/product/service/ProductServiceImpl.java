package com.ecom.product.service;

import com.ecom.product.dto.*;
import com.ecom.product.entity.Category;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.CategoryRepository;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.utils.ProductUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private static final String ACTIVE_STATUS = "ACTIVE";
    private static final String DEFAULT_IMAGE_URL = "placehold.co/600x400";
    private static final String ASCENDING_ORDER = "asc";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductRowDTO createProduct(ProductDTO productDTO, Long userId) {
        Category category = findCategoryById(productDTO.getCate().getId());
        
        Product product = buildProductFromDTO(productDTO, category, userId);
        Product savedProduct = productRepository.save(product);
        
        return mapToProductRowDTO(savedProduct);
    }

    @Override
    public ProductDTO getProductById(Long productId) {
        Product product = findProductById(productId);
        return mapToProductDTO(product);
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product existingProduct = findProductById(productId);
        
        modelMapper.map(productDTO, existingProduct);
        Product updatedProduct = productRepository.save(existingProduct);
        
        return mapToProductDTO(updatedProduct);
    }

    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product product = findProductById(productId);
        productRepository.delete(product);
        
        return mapToProductDTO(product);
    }

    @Override
    public ProductResponse getAllProductsForSeller(Integer page, Integer perPage, 
                                                   String name, String category, 
                                                   String sortBy, String sortOrder, 
                                                   Long userId) {
        Pageable pageable = createPageable(page, perPage, sortBy, sortOrder);
        
        Specification<Product> specification = buildSellerProductSpecification(userId, name, category);
        
        return fetchAndMapProducts(specification, pageable);
    }

    @Override
    public ProductResponse getAllPublicProducts(Integer page, Integer perPage, 
                                                String category, String search, 
                                                String sortBy, String sortOrder) {
        Pageable pageable = createPageable(page, perPage, sortBy, sortOrder);
        
        Specification<Product> specification = buildPublicProductSpecification(search, category);
        
        return fetchAndMapProducts(specification, pageable);
    }

    @Override
    public ProductDTO getPublicProductById(Long productId) {
        Product product = findProductById(productId);
        validateProductIsActive(product);
        
        return mapToProductDTO(product);
    }

    @Override
    public ProductDetailDTO getProductWithVariants(Long productId) {
        Product product = findProductById(productId);
        validateProductIsActive(product);
        
        return mapToProductDetailDTO(product);
    }

    // ==================== Private Helper Methods ====================

    private Category findCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "Id", categoryId));
    }

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));
    }

    private void validateProductIsActive(Product product) {
        if (!ACTIVE_STATUS.equals(product.getStatus())) {
            throw new ResourceNotFoundException("Product", "ProductId", product.getId());
        }
    }

    private Product buildProductFromDTO(ProductDTO productDTO, Category category, Long userId) {
        Product product = modelMapper.map(productDTO, Product.class);
        product.setCategory(category);
        product.setUserId(userId);
        return product;
    }

    private Pageable createPageable(Integer page, Integer perPage, String sortBy, String sortOrder) {
        Sort sort = ASCENDING_ORDER.equalsIgnoreCase(sortOrder) 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        return PageRequest.of(page, perPage, sort);
    }

    private Specification<Product> buildSellerProductSpecification(Long userId, String name, String category) {
        return Specification.allOf(ProductUtils.userIdEquals(userId))
                .and(ProductUtils.nameContains(name))
                .and(ProductUtils.categoryEquals(category));
    }

    private Specification<Product> buildPublicProductSpecification(String search, String category) {
        return Specification.where(ProductUtils.statusEquals(ACTIVE_STATUS))
                .and(ProductUtils.nameContains(search))
                .and(ProductUtils.categoryEquals(category));
    }

    private ProductResponse fetchAndMapProducts(Specification<Product> specification, Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(specification, pageable);
        List<ProductRowDTO> productRows = mapToProductRowDTOs(productPage.getContent());
        
        return buildProductResponse(productPage, productRows);
    }

    private List<ProductRowDTO> mapToProductRowDTOs(List<Product> products) {
        return products.stream()
                .map(this::mapToProductRowDTO)
                .toList();
    }

    private ProductRowDTO mapToProductRowDTO(Product product) {
        return ProductRowDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .category(mapToCategoryDTO(product.getCategory()))
                .imageUrl(getFirstImageUrl(product))
                .status(product.getStatus())
                .minPrice(calculateMinPrice(product))
                .variants(product.getVariants().size())
                .firstVariant(findFirstAvailableVariant(product))
                .build();
    }

    private ProductDTO mapToProductDTO(Product product) {
        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        productDTO.setCate(mapToCategoryDTO(product.getCategory()));
        return productDTO;
    }

    private ProductDetailDTO mapToProductDetailDTO(Product product) {
        ProductDetailDTO productDetailDTO = modelMapper.map(product, ProductDetailDTO.class);
        productDetailDTO.setCate(mapToCategoryDTO(product.getCategory()));
        productDetailDTO.setOptions(mapProductOptions(product));
        productDetailDTO.setVariants(mapActiveVariants(product));
        productDetailDTO.setImages(mapProductImages(product));
        
        return productDetailDTO;
    }

    private CategoryDTO mapToCategoryDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }

    private String getFirstImageUrl(Product product) {
        return product.getImages().isEmpty() 
                ? DEFAULT_IMAGE_URL 
                : product.getImages().get(0).getImageUrl();
    }

    private BigDecimal calculateMinPrice(Product product) {
        return product.getVariants().stream()
                .filter(this::isAvailableVariant)
                .map(ProductVariant::getEffectivePrice)
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    private ProductVariantDTO findFirstAvailableVariant(Product product) {
        Optional<ProductVariant> variant = findFirstVariantWithStock(product)
                .or(() -> findFirstActiveVariant(product));
        
        return variant
                .map(v -> modelMapper.map(v, ProductVariantDTO.class))
                .orElse(null);
    }

    private Optional<ProductVariant> findFirstVariantWithStock(Product product) {
        return product.getVariants().stream()
                .filter(ProductVariant::getIsActive)
                .filter(v -> v.getStock() > 0)
                .findFirst();
    }

    private Optional<ProductVariant> findFirstActiveVariant(Product product) {
        return product.getVariants().stream()
                .filter(ProductVariant::getIsActive)
                .findFirst();
    }

    private boolean isAvailableVariant(ProductVariant variant) {
        return variant.getIsActive() && !variant.getDeleted();
    }

    private List<ProductOptionDTO> mapProductOptions(Product product) {
        return product.getOptions().stream()
                .map(option -> modelMapper.map(option, ProductOptionDTO.class))
                .collect(Collectors.toList());
    }

    private List<ProductVariantDTO> mapActiveVariants(Product product) {
        return product.getVariants().stream()
                .filter(ProductVariant::getIsActive)
                .map(variant -> modelMapper.map(variant, ProductVariantDTO.class))
                .collect(Collectors.toList());
    }

    private List<ProductImageDTO> mapProductImages(Product product) {
        return product.getImages().stream()
                .map(image -> modelMapper.map(image, ProductImageDTO.class))
                .collect(Collectors.toList());
    }

    private ProductResponse buildProductResponse(Page<Product> productPage, List<ProductRowDTO> productRows) {
        ProductResponse response = new ProductResponse();
        response.setContent(productRows);
        response.setPageNumber(productPage.getNumber());
        response.setPageSize(productPage.getSize());
        response.setTotalElements(productPage.getTotalElements());
        response.setTotalPages(productPage.getTotalPages());
        response.setLastPage(productPage.isLast());
        
        return response;
    }
}
