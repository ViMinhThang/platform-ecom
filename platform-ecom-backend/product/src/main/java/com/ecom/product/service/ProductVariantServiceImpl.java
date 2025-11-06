package com.ecom.product.service;

import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.repository.ProductVariantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ProductVariantDTO createProductVariant(Long productId, ProductVariantDTO productVariantDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        ProductVariant productVariant = modelMapper.map(productVariantDTO, ProductVariant.class);
        productVariant.setProduct(product);

        ProductVariant savedVariant = productVariantRepository.save(productVariant);
        return modelMapper.map(savedVariant, ProductVariantDTO.class);
    }

    @Override
    public List<ProductVariantDTO> getVariantsForProduct(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        return variants.stream()
                .map(variant -> modelMapper.map(variant, ProductVariantDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductVariantDTO getProductVariantById(Long productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
        return modelMapper.map(variant, ProductVariantDTO.class);
    }

    @Override
    public ProductVariantDTO updateProductVariant(Long productId, Long variantId, ProductVariantDTO productVariantDTO) {
        ProductVariant variant = productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));

        modelMapper.map(productVariantDTO, variant);
        variant.setId(variantId);

        ProductVariant updatedVariant = productVariantRepository.save(variant);
        return modelMapper.map(updatedVariant, ProductVariantDTO.class);
    }

    @Override
    public void deleteProductVariant(Long productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
        productVariantRepository.delete(variant);
    }
}
