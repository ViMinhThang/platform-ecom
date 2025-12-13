package com.ecom.product.service.impl;

import com.ecom.product.dto.ProductOptionDTO;
import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductOption;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.repository.ProductOptionRepository;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.service.signature.ProductOptionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductOptionServiceImpl implements ProductOptionService {

    private final ProductOptionRepository productOptionRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductOptionDTO createProductOption(ProductOptionDTO dto, Long productId) {
        Product product = findProductById(productId);

        ProductOption option = buildProductOption(dto, product);
        ProductOption savedOption = productOptionRepository.save(option);

        addProductOptionToProduct(product, savedOption);

        return mapToProductOptionDTO(savedOption);
    }

    @Override
    public List<ProductOptionDTO> getAllProductOptions() {
        List<ProductOption> options = productOptionRepository.findAll();
        return mapToProductOptionDTOs(options);
    }

    @Override
    public List<ProductOptionDTO> getProductOptionById(Long productId) {
        Product product = findProductById(productId);
        return mapToProductOptionDTOs(product.getOptions());
    }

    @Override
    @Transactional
    public ProductOptionDTO updateProductOption(ProductOptionDTO productOptionDTO, Long productId, Long optionId) {
        Product product = findProductById(productId);
        ProductOption option = findProductOptionById(optionId);

        updateOptionDetails(option, productOptionDTO, product);
        updateOptionValues(option, productOptionDTO.getValues());

        ProductOption updatedOption = productOptionRepository.save(option);
        ensureOptionLinkedToProduct(product, updatedOption);

        return mapToProductOptionDTO(updatedOption);
    }

    @Override
    public void deleteProductOption(Long optionId, Long productId) {
        Product product = findProductById(productId);
        ProductOption option = findProductOptionById(optionId);

        product.getOptions().remove(option);
        productRepository.save(product);
    }

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));
    }

    private ProductOption findProductOptionById(Long optionId) {
        return productOptionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOption", "optionId", optionId));
    }

    private ProductOption buildProductOption(ProductOptionDTO dto, Product product) {
        ProductOption option = modelMapper.map(dto, ProductOption.class);
        option.setProduct(product);

        if (option.getValues() != null) {
            option.getValues().forEach(v -> v.setOption(option));
        }
        return option;
    }

    private void addProductOptionToProduct(Product product, ProductOption option) {
        product.getOptions().add(option);
        productRepository.save(product);
    }

    private void updateOptionDetails(ProductOption option, ProductOptionDTO dto, Product product) {
        option.setName(dto.getName());
        option.setDisplayName(dto.getDisplayName());
        option.setIsRequired(dto.getIsRequired());
        option.setSortOrder(dto.getSortOrder());
        option.setProduct(product);
    }

    private void updateOptionValues(ProductOption option, List<ProductOptionValueDTO> valueDTOs) {
        if (valueDTOs == null)
            return;

        Map<Long, ProductOptionValue> existingValues = mapExistingValues(option);
        List<ProductOptionValue> updatedValues = new ArrayList<>();

        for (ProductOptionValueDTO valueDTO : valueDTOs) {
            ProductOptionValue value = processOptionValue(valueDTO, existingValues, option);
            updatedValues.add(value);
        }

        option.getValues().clear();
        option.getValues().addAll(updatedValues);
    }

    private Map<Long, ProductOptionValue> mapExistingValues(ProductOption option) {
        return option.getValues().stream()
                .collect(Collectors.toMap(ProductOptionValue::getId, v -> v));
    }

    private ProductOptionValue processOptionValue(ProductOptionValueDTO valueDTO,
            Map<Long, ProductOptionValue> existingValues,
            ProductOption option) {
        if (isExistingValue(valueDTO, existingValues)) {
            return updateExistingValue(existingValues.get(valueDTO.getId()), valueDTO);
        } else {
            return createNewValue(valueDTO, option);
        }
    }

    private boolean isExistingValue(ProductOptionValueDTO valueDTO, Map<Long, ProductOptionValue> existingValues) {
        return valueDTO.getId() != null && existingValues.containsKey(valueDTO.getId());
    }

    private ProductOptionValue updateExistingValue(ProductOptionValue value, ProductOptionValueDTO dto) {
        value.setValue(dto.getValue());
        value.setDisplayValue(dto.getDisplayValue());
        value.setSortOrder(dto.getSortOrder());
        return value;
    }

    private ProductOptionValue createNewValue(ProductOptionValueDTO dto, ProductOption option) {
        ProductOptionValue value = new ProductOptionValue();
        value.setValue(dto.getValue());
        value.setDisplayValue(dto.getDisplayValue());
        value.setSortOrder(dto.getSortOrder());
        value.setOption(option);
        return value;
    }

    private void ensureOptionLinkedToProduct(Product product, ProductOption option) {
        if (!product.getOptions().contains(option)) {
            product.getOptions().add(option);
            productRepository.save(product);
        }
    }

    private ProductOptionDTO mapToProductOptionDTO(ProductOption option) {
        return modelMapper.map(option, ProductOptionDTO.class);
    }

    private List<ProductOptionDTO> mapToProductOptionDTOs(java.util.Collection<ProductOption> options) {
        return options.stream()
                .map(this::mapToProductOptionDTO)
                .collect(Collectors.toList());
    }
}
