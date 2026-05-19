package com.ecom.product.service.signature;

import com.ecom.product.dto.ProductVariantDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductVariantService {

    ProductVariantDTO createProductVariant(Long productId, @Valid ProductVariantDTO productVariantDTO);

    List<ProductVariantDTO> getVariantsForProduct(Long productId);

    List<ProductVariantDTO> getVariantsForProduct(Long productId, Boolean hidden);

    List<ProductVariantDTO> getPublicVariantsForProduct(Long productId);

    ProductVariantDTO getProductVariantById(Long productId, Long variantId);

    ProductVariantDTO updateProductVariant(Long productId, Long variantId, @Valid ProductVariantDTO productVariantDTO);

    void deleteProductVariant(Long productId, Long variantId);

    ProductVariantDTO findVariantById(Long variantId);

    ProductVariantDTO toggleVariantVisibility(Long productId, Long variantId);
}
