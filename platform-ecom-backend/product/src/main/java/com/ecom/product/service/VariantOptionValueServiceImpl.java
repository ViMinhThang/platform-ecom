package com.ecom.product.service;

import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.entity.VariantOptionValue;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.ProductOptionValueRepository;
import com.ecom.product.repository.ProductVariantRepository;
import com.ecom.product.repository.VariantOptionValueRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VariantOptionValueServiceImpl implements VariantOptionValueService {

    @Autowired
    private VariantOptionValueRepository variantOptionValueRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductOptionValueRepository productOptionValueRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public VariantOptionValueDTO createVariantOptionValue(VariantOptionValueDTO variantOptionValueDTO) {
        ProductVariant variant = productVariantRepository.findById(variantOptionValueDTO.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantOptionValueDTO.getVariantId()));

        ProductOptionValue optionValue = productOptionValueRepository.findById(variantOptionValueDTO.getOptionValueId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductOptionValue", "optionValueId", variantOptionValueDTO.getOptionValueId()));

        VariantOptionValue variantOptionValue = new VariantOptionValue();
        variantOptionValue.setVariant(variant);
        variantOptionValue.setOptionValue(optionValue);

        VariantOptionValue savedValue = variantOptionValueRepository.save(variantOptionValue);
        return modelMapper.map(savedValue, VariantOptionValueDTO.class);
    }

    @Override
    public List<VariantOptionValueDTO> getValuesForVariant(Long variantId) {
        List<VariantOptionValue> values = variantOptionValueRepository.findByVariantId(variantId);
        return values.stream()
                .map(value -> modelMapper.map(value, VariantOptionValueDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteVariantOptionValue(Long variantOptionValueId) {
        VariantOptionValue value = variantOptionValueRepository.findById(variantOptionValueId)
                .orElseThrow(() -> new ResourceNotFoundException("VariantOptionValue", "variantOptionValueId", variantOptionValueId));
        variantOptionValueRepository.delete(value);
    }
}
