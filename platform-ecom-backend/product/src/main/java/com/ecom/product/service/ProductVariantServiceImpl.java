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
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductOptionValueRepository optionValueRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ProductVariantDTO createProductVariant(Long productId, ProductVariantDTO productVariantDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        ProductVariant productVariant = modelMapper.map(productVariantDTO, ProductVariant.class);
        productVariant.setProduct(product);

        ProductVariant savedVariant = productVariantRepository.save(productVariant);
        return mapToVariantDTO(savedVariant);
    }

    @Override
    public List<ProductVariantDTO> getVariantsForProduct(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        return variants.stream()
                .map(this::mapToVariantDTO)
                .sorted(Comparator.comparing(ProductVariantDTO::getId)).toList();
    }


    @Override
    public ProductVariantDTO getProductVariantById(Long productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
        return modelMapper.map(variant, ProductVariantDTO.class);
    }

    @Override
    @Transactional
    public ProductVariantDTO updateProductVariant(Long productId, Long variantId, ProductVariantDTO dto) {
        ProductVariant variant = productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));

        Set<Long> newOptionValueIds = dto.getOptionValues() == null
                ? Set.of()
                : dto.getOptionValues().stream()
                .map(opt -> opt.getProductOptionValue().getId())
                .collect(Collectors.toSet());

        List<ProductVariant> otherVariants = productVariantRepository.findByProductId(productId).stream()
                .filter(v -> !v.getId().equals(variantId))
                .toList();

        boolean duplicateExists = otherVariants.stream().anyMatch(v -> {
            Set<Long> existingIds = v.getOptionValues().stream()
                    .map(vo -> vo.getOptionValue().getId())
                    .collect(Collectors.toSet());
            return existingIds.equals(newOptionValueIds);
        });

        if (duplicateExists) {
            throw new APIException("A variant with the same option combination already exists.");
        }

        variant.setSku(dto.getSku());
        variant.setPrice(dto.getPrice());
        variant.setStock(dto.getStock());
        variant.setIsActive(dto.getIsActive());
        variant.setImageUrl(dto.getImageUrl());

        variant.getOptionValues().clear();
        if (dto.getOptionValues() != null) {
            for (VariantOptionValueDTO opt : dto.getOptionValues()) {
                VariantOptionValue vo = new VariantOptionValue();
                vo.setVariant(variant);
                vo.setOptionValue(optionValueRepository.getReferenceById(opt.getProductOptionValue().getId()));
                vo.setPriceModifier(opt.getPriceModifier());
                variant.getOptionValues().add(vo);
            }
        }

        ProductVariant saved = productVariantRepository.save(variant);
        return mapToVariantDTO(saved);
    }



    @Override
    public void deleteProductVariant(Long productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
        productVariantRepository.delete(variant);
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
        List<VariantOptionValueDTO> optionValueDTOs = variant.getOptionValues().stream()
                .map(vov -> {
                    VariantOptionValueDTO vovDTO = new VariantOptionValueDTO();
                    vovDTO.setId(vov.getId());
                    vovDTO.setVariantId(variant.getId());
                    vovDTO.setOptionId(vov.getOptionValue().getOption().getId());
                    vovDTO.setPriceModifier(vov.getPriceModifier());

                    ProductOptionValueDTO productOptionValueDTO = getProductOptionValueDTO(vov);
                    vovDTO.setProductOptionValue(productOptionValueDTO);

                    return vovDTO;
                })
                .toList();
        dto.setOptionValues(optionValueDTOs);
        return dto;
    }

    @NotNull
    private static ProductOptionValueDTO getProductOptionValueDTO(VariantOptionValue vov) {
        ProductOptionValue pov = vov.getOptionValue();
        ProductOptionValueDTO productOptionValueDTO = new ProductOptionValueDTO();
        productOptionValueDTO.setId(pov.getId());
        productOptionValueDTO.setValue(pov.getValue());
        productOptionValueDTO.setDisplayValue(pov.getDisplayValue());
        return productOptionValueDTO;
    }

}
