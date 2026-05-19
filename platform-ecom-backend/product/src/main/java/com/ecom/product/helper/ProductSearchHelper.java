package com.ecom.product.helper;

import com.ecom.product.dto.ProductRowDTO;
import com.ecom.product.dto.response.ProductResponse;
import com.ecom.product.entity.Product;
import com.ecom.product.enums.ProductStatus;
import com.ecom.product.mapper.ProductMapper;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.utils.ProductUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductSearchHelper {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductResponse getAllProductsForSeller(Pageable pageable, Long userId, String name, String category) {
        Specification<Product> specification = buildSellerProductSpecification(userId, name, category);
        return fetchAndMapProducts(specification, pageable);
    }

    public ProductResponse getAllPublicProducts(Pageable pageable, String category, String search,
            BigDecimal minPrice, BigDecimal maxPrice, Double minRating, Boolean inStock, List<Long> sellerIds) {
        Specification<Product> specification = buildPublicProductSpecification(search, category, minPrice, maxPrice,
                minRating, inStock, sellerIds);
        return fetchAndMapProducts(specification, pageable);
    }

    public ProductResponse getAllPublicProductsBySeller(Long userId, Pageable pageable, String category,
            BigDecimal minPrice, BigDecimal maxPrice, Double minRating, Boolean inStock) {
        Specification<Product> specification = buildPublicProductSpecification(null, category, minPrice, maxPrice,
                minRating, inStock, null).and(ProductUtils.userIdEquals(userId));
        return fetchAndMapProducts(specification, pageable);
    }

    private Specification<Product> buildSellerProductSpecification(Long userId, String name, String category) {
        return Specification.allOf(ProductUtils.userIdEquals(userId))
                .and(ProductUtils.nameContains(name))
                .and(ProductUtils.categoryEquals(category));
    }

    private Specification<Product> buildPublicProductSpecification(String search, String category, BigDecimal minPrice,
            BigDecimal maxPrice, Double minRating, Boolean inStock, List<Long> sellerIds) {
        Specification<Product> spec = ProductUtils.statusEquals(ProductStatus.ACTIVE.getValue())
                .and(ProductUtils.isNotDeleted());

        if (search != null && !search.isEmpty()) {
            spec = spec.and(ProductUtils.nameContains(search));
        }

        if (category != null && !category.isEmpty()) {
            spec = spec.and(ProductUtils.categorySlugEquals(category)
                    .or(ProductUtils.categoryEquals(category)));
        }

        if (minPrice != null || maxPrice != null) {
            spec = spec.and(ProductUtils.priceRange(minPrice, maxPrice));
        }

        if (minRating != null) {
            spec = spec.and(ProductUtils.ratingGreaterThanOrEqual(minRating));
        }

        if (inStock != null && inStock) {
            spec = spec.and(ProductUtils.hasStock(inStock));
        }

        if (sellerIds != null && !sellerIds.isEmpty()) {
            spec = spec.and(ProductUtils.userIdIn(sellerIds));
        }

        return spec;
    }

    private ProductResponse fetchAndMapProducts(Specification<Product> specification, Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(specification, pageable);
        List<ProductRowDTO> productRows = productMapper.toRowDTOs(productPage.getContent());

        return buildProductResponse(productPage, productRows);
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
