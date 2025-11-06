package com.ecom.product.service;

import com.ecom.product.dto.ProductImageDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductImageService {

    ProductImageDTO addImageToProduct(Long productId, @Valid ProductImageDTO productImageDTO);

    List<ProductImageDTO> getProductImages(Long productId);

    ProductImageDTO getProductImageById(Long productId, Long imageId);

    ProductImageDTO updateProductImage(Long productId, Long imageId, @Valid ProductImageDTO productImageDTO);

    void deleteProductImage(Long productId, Long imageId);
}
