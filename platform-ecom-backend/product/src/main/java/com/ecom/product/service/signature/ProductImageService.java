package com.ecom.product.service.signature;

import com.ecom.product.dto.ProductImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductImageService {

    ProductImageDTO addImageToProduct(Long productId, MultipartFile image);

    List<ProductImageDTO> getProductImages(Long productId);

    ProductImageDTO getProductImageById(Long productId, Long imageId);

    ProductImageDTO updateProductImage(Long productId, Long imageId, MultipartFile image);

    void deleteProductImage(Long productId, Long imageId);
}
