package com.ecom.product.service.impl;

import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.entity.VariantOptionValue;
import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import java.math.BigDecimal;
import java.util.Objects;
import com.ecom.product.mapper.ProductVariantMapper;
import com.ecom.product.repository.ProductOptionValueRepository;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.repository.ProductVariantRepository;
import com.ecom.product.service.signature.ProductVariantService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductOptionValueRepository optionValueRepository;
    private final ProductVariantMapper productVariantMapper;

    @Override
    @Transactional
    public ProductVariantDTO createProductVariant(Long productId, ProductVariantDTO productVariantDTO) {
        Product product = findProductById(productId);

        ProductVariant productVariant = new ProductVariant();
        productVariant.setProduct(product);

        updateVariantDetails(productVariant, productVariantDTO);
        updateVariantOptionValues(productVariant, productVariantDTO.getOptionValues());

        ProductVariant savedVariant = productVariantRepository.save(productVariant);

        // Update product min price
        updateProductMinPrice(productId);

        return productVariantMapper.toDTO(savedVariant);
    }

    @Override
    @Transactional
    public List<ProductVariantDTO> getVariantsForProduct(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        return mapAndSortVariants(variants);
    }

    @Override
    @Transactional
    public List<ProductVariantDTO> getVariantsForProduct(Long productId, Boolean hidden) {
        List<ProductVariant> variants = (hidden == null)
                ? productVariantRepository.findByProductId(productId)
                : productVariantRepository.findByProductIdAndHidden(productId, hidden);
        return mapAndSortVariants(variants);
    }

    @Override
    @Transactional
    public List<ProductVariantDTO> getPublicVariantsForProduct(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductIdAndHiddenFalse(productId);
        return mapAndSortVariants(variants);
    }

    @Override
    @Transactional
    public ProductVariantDTO getProductVariantById(Long productId, Long variantId) {
        ProductVariant variant = findProductVariant(productId, variantId);
        return productVariantMapper.toDTO(variant);
    }

    @Override
    @Transactional
    public ProductVariantDTO updateProductVariant(Long productId, Long variantId, ProductVariantDTO dto) {
        ProductVariant variant = findProductVariant(productId, variantId);

        validateNoDuplicateVariant(productId, variantId, dto);

        updateVariantDetails(variant, dto);
        updateVariantOptionValues(variant, dto.getOptionValues());

        ProductVariant saved = productVariantRepository.save(variant);

        // Update product min price
        updateProductMinPrice(productId);

        return productVariantMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteProductVariant(Long productId, Long variantId) {
        ProductVariant variant = findProductVariant(productId, variantId);
        productVariantRepository.delete(variant);
    }

    @Override
    @Transactional
    public ProductVariantDTO findVariantById(Long variantId) {
        ProductVariant variant = findVariantByVariantId(variantId);
        return productVariantMapper.toDTO(variant);
    }

    @Override
    @Transactional
    public ProductVariantDTO toggleVariantVisibility(Long productId, Long variantId) {
        ProductVariant variant = findProductVariant(productId, variantId);
        variant.setHidden(!Boolean.TRUE.equals(variant.getHidden()));
        ProductVariant saved = productVariantRepository.save(variant);

        // Update product min price because visibility changed
        updateProductMinPrice(productId);

        return productVariantMapper.toDTO(saved);
    }

    private void updateProductMinPrice(Long productId) {
        Product product = findProductById(productId);
        List<ProductVariant> activeVariants = productVariantRepository.findByProductIdAndHiddenFalse(productId);

        if (activeVariants.isEmpty()) {
            product.setMinPrice(null);
        } else {
            BigDecimal minPrice = activeVariants.stream()
                    .map(ProductVariant::getPrice)
                    .filter(Objects::nonNull)
                    .min(BigDecimal::compareTo)
                    .orElse(null);
            product.setMinPrice(minPrice);
        }
        productRepository.save(product);
    }

    // ==================== Private Helper Methods ====================

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    }

    private ProductVariant findVariantByVariantId(Long variantId) {
        return productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
    }

    private ProductVariant findProductVariant(Long productId, Long variantId) {
        return productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
    }

    private List<ProductVariantDTO> mapAndSortVariants(List<ProductVariant> variants) {
        return variants.stream()
                .map(productVariantMapper::toDTO)
                .sorted(Comparator.comparing(ProductVariantDTO::getId))
                .collect(Collectors.toList());
    }

    private void validateNoDuplicateVariant(Long productId, Long variantId, ProductVariantDTO dto) {
        Set<Long> newOptionValueIds = extractOptionValueIds(dto);
        List<ProductVariant> otherVariants = findOtherVariants(productId, variantId);

        boolean duplicateExists = otherVariants.stream()
                .anyMatch(v -> hasSameOptionValues(v, newOptionValueIds));

        if (duplicateExists) {
            throw new APIException("A variant with the same option combination already exists.");
        }
    }

    private Set<Long> extractOptionValueIds(ProductVariantDTO dto) {
        if (dto.getOptionValues() == null)
            return Set.of();

        return dto.getOptionValues().stream()
                .map(opt -> opt.getProductOptionValue().getId())
                .collect(Collectors.toSet());
    }

    private List<ProductVariant> findOtherVariants(Long productId, Long variantId) {
        return productVariantRepository.findByProductId(productId).stream()
                .filter(v -> !v.getId().equals(variantId))
                .collect(Collectors.toList());
    }

    private boolean hasSameOptionValues(ProductVariant variant, Set<Long> targetIds) {
        Set<Long> existingIds = variant.getOptionValues().stream()
                .map(vo -> vo.getOptionValue().getId())
                .collect(Collectors.toSet());
        return existingIds.equals(targetIds);
    }

    private void updateVariantDetails(ProductVariant variant, ProductVariantDTO dto) {
        variant.setSku(dto.getSku());
        variant.setPrice(dto.getPrice());
        variant.setSalePrice(dto.getSalePrice());
        variant.setSaleStart(dto.getSaleStart());
        variant.setSaleEnd(dto.getSaleEnd());
        variant.setStock(dto.getStock());
        variant.setIsActive(dto.getIsActive());
        variant.setImageUrl(dto.getImageUrl());
    }

    private void updateVariantOptionValues(ProductVariant variant, List<VariantOptionValueDTO> optionValueDTOs) {
        variant.getOptionValues().clear();

        if (optionValueDTOs != null) {
            for (VariantOptionValueDTO opt : optionValueDTOs) {
                addVariantOptionValue(variant, opt);
            }
        }
    }

    private void addVariantOptionValue(ProductVariant variant, VariantOptionValueDTO opt) {
        VariantOptionValue vo = new VariantOptionValue();
        vo.setVariant(variant);
        vo.setOptionValue(optionValueRepository.getReferenceById(opt.getProductOptionValue().getId()));
        vo.setPriceModifier(opt.getPriceModifier());
        variant.getOptionValues().add(vo);
    }
}
