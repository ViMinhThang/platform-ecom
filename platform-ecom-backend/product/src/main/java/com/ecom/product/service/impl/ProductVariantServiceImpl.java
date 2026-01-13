package com.ecom.product.service.impl;

import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.*;
import com.ecom.product.helper.*;
import com.ecom.product.mapper.ProductVariantMapper;
import com.ecom.product.repository.ProductOptionValueRepository;
import com.ecom.product.repository.ProductVariantRepository;
import com.ecom.product.service.signature.ProductVariantService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductOptionValueRepository optionValueRepository;
    private final ProductVariantMapper productVariantMapper;
    private final ProductHelper productHelper;
    private final ProductVariantHelper productVariantHelper;
    private final ProductVariantValidator validator;
    private final ProductPriceHelper priceHelper;

    @Override
    @Transactional
    public ProductVariantDTO createProductVariant(Long productId, ProductVariantDTO productVariantDTO) {
        Product product = productHelper.findByIdOrThrow(productId);

        validator.validateNoDuplicateVariant(productId, null, productVariantDTO);

        ProductVariant productVariant = new ProductVariant();
        productVariant.setProduct(product);

        updateVariantDetails(productVariant, productVariantDTO);
        updateVariantOptionValues(productVariant, productVariantDTO.getOptionValues());

        ProductVariant savedVariant = productVariantRepository.save(productVariant);

        priceHelper.updateProductPriceRange(productId);

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
        ProductVariant variant = productVariantHelper.findByProductIdAndIdOrThrow(productId, variantId);
        return productVariantMapper.toDTO(variant);
    }

    @Override
    @Transactional
    public ProductVariantDTO updateProductVariant(Long productId, Long variantId, ProductVariantDTO dto) {
        ProductVariant variant = productVariantHelper.findByProductIdAndIdOrThrow(productId, variantId);

        validator.validateNoDuplicateVariant(productId, variantId, dto);

        updateVariantDetails(variant, dto);
        updateVariantOptionValues(variant, dto.getOptionValues());

        productVariantRepository.save(variant);
        priceHelper.updateProductPriceRange(productId);

        return productVariantMapper.toDTO(variant);
    }

    @Override
    @Transactional
    public void deleteProductVariant(Long productId, Long variantId) {
        ProductVariant variant = productVariantHelper.findByProductIdAndIdOrThrow(productId, variantId);
        productVariantRepository.delete(variant);

        priceHelper.updateProductPriceRange(productId);
    }

    @Override
    @Transactional
    public ProductVariantDTO findVariantById(Long variantId) {
        ProductVariant variant = productVariantHelper.findByIdOrThrow(variantId);
        return productVariantMapper.toDTO(variant);
    }

    @Override
    @Transactional
    public ProductVariantDTO toggleVariantVisibility(Long productId, Long variantId) {
        ProductVariant variant = productVariantHelper.findByProductIdAndIdOrThrow(productId, variantId);
        variant.setHidden(!Boolean.TRUE.equals(variant.getHidden()));
        productVariantRepository.save(variant);

        priceHelper.updateProductPriceRange(productId);

        return productVariantMapper.toDTO(variant);
    }

    // ==================== Private Helper Methods ====================

    private List<ProductVariantDTO> mapAndSortVariants(List<ProductVariant> variants) {
        return variants.stream()
                .map(productVariantMapper::toDTO)
                .sorted(Comparator.comparing(ProductVariantDTO::getId))
                .collect(Collectors.toList());
    }

    private void updateVariantDetails(ProductVariant variant, ProductVariantDTO dto) {
        variant.setSku(dto.getSku());
        variant.setPrice(dto.getPrice());
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
