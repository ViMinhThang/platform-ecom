package com.ecom.product.service.impl;

import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.*;
import com.ecom.product.helper.ProductOptionValueHelper;
import com.ecom.product.helper.ProductVariantHelper;
import com.ecom.product.helper.VariantOptionValueHelper;
import com.ecom.product.repository.*;
import com.ecom.product.service.signature.VariantOptionValueService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VariantOptionValueServiceImpl implements VariantOptionValueService {

    private final VariantOptionValueRepository variantOptionValueRepository;
    private final ModelMapper modelMapper;
    private final ProductVariantHelper productVariantHelper;
    private final ProductOptionValueHelper productOptionValueHelper;
    private final VariantOptionValueHelper variantOptionValueHelper;

    @Override
    public VariantOptionValueDTO createVariantOptionValue(VariantOptionValueDTO dto) {
        ProductVariant variant = productVariantHelper.findByIdOrThrow(dto.getVariantId());
        ProductOptionValue optionValue = productOptionValueHelper.findByIdOrThrow(dto.getProductOptionValue().getId());

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
        VariantOptionValue value = variantOptionValueHelper.findByIdOrThrow(variantOptionValueId);
        variantOptionValueRepository.delete(value);
    }

    // ==================== Private Helper Methods ====================

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
