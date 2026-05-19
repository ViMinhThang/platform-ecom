package com.ecom.product.service.impl;

import com.ecom.product.dto.ProductOptionDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductOption;
import com.ecom.product.helper.ProductHelper;
import com.ecom.product.helper.ProductOptionHelper;
import com.ecom.product.helper.ProductOptionValueHelper;
import com.ecom.product.repository.ProductOptionRepository;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.service.signature.ProductOptionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductOptionServiceImpl implements ProductOptionService {

    private final ProductOptionRepository productOptionRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final ProductHelper productHelper;
    private final ProductOptionHelper productOptionHelper;
    private final ProductOptionValueHelper optionValueHelper;

    @Override
    @Transactional
    public ProductOptionDTO createProductOption(ProductOptionDTO dto, Long productId) {
        Product product = productHelper.findByIdOrThrow(productId);

        ProductOption option = buildProductOption(dto, product);
        ProductOption savedOption = productOptionRepository.save(option);

        addProductOptionToProduct(product, savedOption);

        return mapToProductOptionDTO(savedOption);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductOptionDTO> getAllProductOptions() {
        return mapToProductOptionDTOs(productOptionRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductOptionDTO> getProductOptionById(Long productId) {
        Product product = productHelper.findByIdOrThrow(productId);
        return mapToProductOptionDTOs(product.getOptions());
    }

    @Override
    @Transactional
    public ProductOptionDTO updateProductOption(ProductOptionDTO productOptionDTO, Long productId, Long optionId) {
        Product product = productHelper.findByIdOrThrow(productId);
        ProductOption option = productOptionHelper.findByIdOrThrow(optionId);

        updateOptionDetails(option, productOptionDTO, product);
        optionValueHelper.updateOptionValues(option, productOptionDTO.getValues());

        ProductOption updatedOption = productOptionRepository.save(option);
        ensureOptionLinkedToProduct(product, updatedOption);

        return mapToProductOptionDTO(updatedOption);
    }

    @Override
    @Transactional
    public void deleteProductOption(Long optionId, Long productId) {
        Product product = productHelper.findByIdOrThrow(productId);
        ProductOption option = productOptionHelper.findByIdOrThrow(optionId);

        product.getOptions().remove(option);
        productRepository.save(product);
    }

    // ==================== Private Helper Methods ====================

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
