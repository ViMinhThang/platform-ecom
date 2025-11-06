package com.ecom.product.service;

import com.ecom.product.dto.ProductOptionDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductOption;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.ProductOptionRepository;
import com.ecom.product.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductOptionServiceImpl implements ProductOptionService {

    @Autowired
    private ProductOptionRepository productOptionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    ProductRepository productRepository;


    @Override
    public ProductOptionDTO createProductOption(ProductOptionDTO dto, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        ProductOption option = modelMapper.map(dto, ProductOption.class);
        option.setProduct(product);
        if (option.getValues() != null) {
            option.getValues().forEach(v -> v.setOption(option));
        }
        ProductOption savedOption = productOptionRepository.save(option);

        product.getOptions().add(savedOption);
        productRepository.save(product);

        return modelMapper.map(savedOption, ProductOptionDTO.class);
    }

    @Override
    public List<ProductOptionDTO> getAllProductOptions() {
        List<ProductOption> options = productOptionRepository.findAll();
        return options.stream()
                .map(option -> modelMapper.map(option, ProductOptionDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductOptionDTO> getProductOptionById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));
        return product.getOptions().stream()
                .map(productOption -> modelMapper.map(productOption, ProductOptionDTO.class))
                .toList();
    }

    @Override
    public ProductOptionDTO updateProductOption(ProductOptionDTO productOptionDTO, Long productId, Long optionId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));

        ProductOption option = productOptionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOption", "optionId", optionId));

        option.setName(productOptionDTO.getName());
        option.setDisplayName(productOptionDTO.getDisplayName());
        option.setIsRequired(productOptionDTO.getIsRequired());
        option.setSortOrder(productOptionDTO.getSortOrder());

        if (productOptionDTO.getValues() != null) {
            option.getValues().clear();
            productOptionDTO.getValues().forEach(valueDTO -> {
                ProductOptionValue value = new ProductOptionValue();
                value.setValue(valueDTO.getValue());
                value.setDisplayValue(valueDTO.getDisplayValue());
                value.setSortOrder(valueDTO.getSortOrder());
                value.setOption(option);
                option.getValues().add(value);
            });
        }
        option.setProduct(product);
        ProductOption updatedOption = productOptionRepository.save(option);

        if (!product.getOptions().contains(updatedOption)) {
            product.getOptions().add(updatedOption);
            productRepository.save(product);
        }

        return modelMapper.map(updatedOption, ProductOptionDTO.class);
    }


    @Override
    public void deleteProductOption(Long optionId,Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));
        ProductOption option = productOptionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOption", "optionId", optionId));
        product.getOptions().remove(option);
        productRepository.save(product);
    }
}
