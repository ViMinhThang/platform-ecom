package com.ecom.product.service;

import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.entity.VariantOptionValue;
import com.ecom.product.exceptions.APIException;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.ProductOptionValueRepository;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.repository.ProductVariantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
    private final ModelMapper modelMapper;

    @Override
    public ProductVariantDTO createProductVariant(Long productId, ProductVariantDTO productVariantDTO) {
        Product product = findProductById(productId);
        
        ProductVariant productVariant = modelMapper.map(productVariantDTO, ProductVariant.class);
        productVariant.setProduct(product);
        
        ProductVariant savedVariant = productVariantRepository.save(productVariant);
        return mapToVariantDTO(savedVariant);
    }

    @Override
    public List<ProductVariantDTO> getVariantsForProduct(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        return mapAndSortVariants(variants);
    }

    @Override
    public ProductVariantDTO getProductVariantById(Long productId, Long variantId) {
        ProductVariant variant = findProductVariant(productId, variantId);
        return modelMapper.map(variant, ProductVariantDTO.class);
    }

    @Override
    @Transactional
    public ProductVariantDTO updateProductVariant(Long productId, Long variantId, ProductVariantDTO dto) {
        ProductVariant variant = findProductVariant(productId, variantId);
        
        validateNoDuplicateVariant(productId, variantId, dto);
        
        updateVariantDetails(variant, dto);
        updateVariantOptionValues(variant, dto.getOptionValues());
        
        ProductVariant saved = productVariantRepository.save(variant);
        return mapToVariantDTO(saved);
    }

    @Override
    public void deleteProductVariant(Long productId, Long variantId) {
        ProductVariant variant = findProductVariant(productId, variantId);
        productVariantRepository.delete(variant);
    }

    // ==================== Private Helper Methods ====================

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    }

    private ProductVariant findProductVariant(Long productId, Long variantId) {
        return productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
    }

    private List<ProductVariantDTO> mapAndSortVariants(List<ProductVariant> variants) {
        return variants.stream()
                .map(this::mapToVariantDTO)
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
        if (dto.getOptionValues() == null) return Set.of();
        
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

    private ProductVariantDTO mapToVariantDTO(ProductVariant variant) {
        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(variant.getId());
        dto.setProductId(variant.getProduct().getId());
        dto.setSku(variant.getSku());
        dto.setPrice(variant.getPrice());
        dto.setStock(variant.getStock());
        dto.setIsActive(variant.getIsActive());
        dto.setCreatedAt(variant.getCreatedAt());
        dto.setUpdatedAt(variant.getUpdatedAt());
        dto.setImageUrl(variant.getImageUrl());
        
        dto.setOptionValues(mapVariantOptionValues(variant));
        
        return dto;
    }

    private List<VariantOptionValueDTO> mapVariantOptionValues(ProductVariant variant) {
        return variant.getOptionValues().stream()
                .map(this::mapToVariantOptionValueDTO)
                .collect(Collectors.toList());
    }

    private VariantOptionValueDTO mapToVariantOptionValueDTO(VariantOptionValue vov) {
        VariantOptionValueDTO vovDTO = new VariantOptionValueDTO();
        vovDTO.setId(vov.getId());
        vovDTO.setVariantId(vov.getVariant().getId());
        vovDTO.setOptionId(vov.getOptionValue().getOption().getId());
        vovDTO.setPriceModifier(vov.getPriceModifier());
        vovDTO.setProductOptionValue(mapToProductOptionValueDTO(vov.getOptionValue()));
        return vovDTO;
    }

    private ProductOptionValueDTO mapToProductOptionValueDTO(ProductOptionValue pov) {
        ProductOptionValueDTO dto = new ProductOptionValueDTO();
        dto.setId(pov.getId());
        dto.setValue(pov.getValue());
        dto.setDisplayValue(pov.getDisplayValue());
        return dto;
    }
}
