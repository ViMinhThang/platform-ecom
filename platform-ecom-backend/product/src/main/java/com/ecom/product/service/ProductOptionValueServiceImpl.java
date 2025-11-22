package com.ecom.product.service;

import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.entity.ProductOption;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.ProductOptionRepository;
import com.ecom.product.repository.ProductOptionValueRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductOptionValueServiceImpl implements ProductOptionValueService {

    @Autowired
    private ProductOptionValueRepository productOptionValueRepository;

    @Autowired
    private ProductOptionRepository productOptionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ProductOptionValueDTO createProductOptionValue(ProductOptionValueDTO productOptionValueDTO) {
        ProductOption option = productOptionRepository.findById(productOptionValueDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductOption", "optionId", productOptionValueDTO.getId()));

        ProductOptionValue productOptionValue = modelMapper.map(productOptionValueDTO, ProductOptionValue.class);
        productOptionValue.setOption(option);

        ProductOptionValue savedValue = productOptionValueRepository.save(productOptionValue);
        return modelMapper.map(savedValue, ProductOptionValueDTO.class);
    }

    @Override
    public List<ProductOptionValueDTO> getValuesForOption(Long optionId) {
        List<ProductOptionValue> values = productOptionValueRepository.findByOptionId(optionId);
        return values.stream()
                .map(value -> modelMapper.map(value, ProductOptionValueDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductOptionValueDTO getProductOptionValueById(Long valueId) {
        ProductOptionValue value = productOptionValueRepository.findById(valueId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOptionValue", "valueId", valueId));
        return modelMapper.map(value, ProductOptionValueDTO.class);
    }

    @Override
public ProductOptionValueDTO updateProductOptionValue(Long valueId, ProductOptionValueDTO productOptionValueDTO) {
    ProductOptionValue value = productOptionValueRepository.findById(valueId)
            .orElseThrow(() -> new ResourceNotFoundException("ProductOptionValue", "valueId", valueId));

    modelMapper.map(productOptionValueDTO, value);
    value.setId(valueId);

    ProductOptionValue updatedValue = productOptionValueRepository.save(value);
    return modelMapper.map(updatedValue, ProductOptionValueDTO.class);
}

    @Override
    public void deleteProductOptionValue(Long valueId) {
        ProductOptionValue value = productOptionValueRepository.findById(valueId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOptionValue", "valueId", valueId));
        productOptionValueRepository.delete(value);
    }
}
