package com.ecom.product.service;

import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.*;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VariantOptionValueServiceImpl implements VariantOptionValueService {

    private final VariantOptionValueRepository variantOptionValueRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductOptionValueRepository productOptionValueRepository;
    private final ModelMapper modelMapper;

    @Override
    public VariantOptionValueDTO createVariantOptionValue(VariantOptionValueDTO dto) {
        ProductVariant variant = findProductVariant(dto.getVariantId());
        ProductOptionValue optionValue = findProductOptionValue(dto.getProductOptionValue().getId());

        VariantOptionValue variantOptionValue = createVariantOptionValueEntity(variant, optionValue);
        VariantOptionValue savedValue = variantOptionValueRepository.save(variantOptionValue);
        
        return mapToDTO(savedValue);
    }

    @Override
    public List<VariantOptionValueDTO> getValuesForVariant(Long variantId) {
        List<VariantOptionValue> values = variantOptionValueRepository.findByVariantId(variantId);
        return mapToDTOs(values);
    }

    @Override
    public void deleteVariantOptionValue(Long variantOptionValueId) {
        VariantOptionValue value = findVariantOptionValue(variantOptionValueId);
        variantOptionValueRepository.delete(value);
    }

    // ==================== Private Helper Methods ====================

    private ProductVariant findProductVariant(Long variantId) {
        return productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
    }

    private ProductOptionValue findProductOptionValue(Long optionValueId) {
        return productOptionValueRepository.findById(optionValueId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOptionValue", "optionValueId", optionValueId));
    }

    private VariantOptionValue findVariantOptionValue(Long id) {
        return variantOptionValueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VariantOptionValue", "variantOptionValueId", id));
    }

    private VariantOptionValue createVariantOptionValueEntity(ProductVariant variant, ProductOptionValue optionValue) {
        VariantOptionValue variantOptionValue = new VariantOptionValue();
        variantOptionValue.setVariant(variant);
        variantOptionValue.setOptionValue(optionValue);
        return variantOptionValue;
    }

    private VariantOptionValueDTO mapToDTO(VariantOptionValue value) {
        return modelMapper.map(value, VariantOptionValueDTO.class);
    }

    private List<VariantOptionValueDTO> mapToDTOs(List<VariantOptionValue> values) {
        return values.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
