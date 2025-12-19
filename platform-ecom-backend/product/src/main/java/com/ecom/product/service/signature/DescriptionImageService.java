package com.ecom.product.service.signature;

import com.ecom.product.dto.DescriptionImageDTO;
import org.springframework.web.multipart.MultipartFile;

public interface DescriptionImageService {
    DescriptionImageDTO uploadImage(Long productId, MultipartFile file);

    void markAsDeleted(Long productId, Long imageId);

    void cleanupDeletedImages();
}
