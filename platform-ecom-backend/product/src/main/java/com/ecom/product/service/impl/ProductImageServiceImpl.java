package com.ecom.product.service.impl;

import com.ecom.product.dto.ProductImageDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductImage;
import com.ecom.product.helper.ProductHelper;
import com.ecom.product.helper.ProductImageHelper;
import com.ecom.product.repository.ProductImageRepository;
import com.ecom.common.service.FileStorageService;
import com.ecom.product.service.signature.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;
    private final ProductHelper productHelper;
    private final ProductImageHelper productImageHelper;

    @Override
    public ProductImageDTO addImageToProduct(Long productId, MultipartFile image) {
        Product product = productHelper.findByIdOrThrow(productId);
        String imageUrl = fileStorageService.storeFile(image);

        ProductImage productImage = createProductImage(product, imageUrl);
        ProductImage savedImage = productImageRepository.save(productImage);

        return mapToProductImageDTO(savedImage);
    }

    @Override
    public List<ProductImageDTO> getProductImages(Long productId) {
        List<ProductImage> images = productImageRepository.findByProductId(productId);
        return mapToProductImageDTOs(images);
    }

    @Override
    public ProductImageDTO getProductImageById(Long productId, Long imageId) {
        ProductImage image = productImageHelper.findByProductIdAndIdOrThrow(productId, imageId);
        return mapToProductImageDTO(image);
    }

    @Override
    public ProductImageDTO updateProductImage(Long productId, Long imageId, MultipartFile imageFile) {
        ProductImage image = productImageHelper.findByProductIdAndIdOrThrow(productId, imageId);

        if (hasNewImageFile(imageFile)) {
            updateImageFile(image, imageFile);
        }

        ProductImage updatedImage = productImageRepository.save(image);
        return mapToProductImageDTO(updatedImage);
    }

    @Override
    public void deleteProductImage(Long productId, Long imageId) {
        ProductImage image = productImageHelper.findByProductIdAndIdOrThrow(productId, imageId);

        fileStorageService.deleteFile(image.getImageUrl());
        productImageRepository.delete(image);
    }

    // ==================== Private Helper Methods ====================

    private ProductImage createProductImage(Product product, String imageUrl) {
        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setImageUrl(imageUrl);
        return productImage;
    }

    private boolean hasNewImageFile(MultipartFile imageFile) {
        return imageFile != null && !imageFile.isEmpty();
    }

    private void updateImageFile(ProductImage image, MultipartFile newImageFile) {
        fileStorageService.deleteFile(image.getImageUrl());
        String newImageUrl = fileStorageService.storeFile(newImageFile);
        image.setImageUrl(newImageUrl);
    }

    private ProductImageDTO mapToProductImageDTO(ProductImage image) {
        return modelMapper.map(image, ProductImageDTO.class);
    }

    private List<ProductImageDTO> mapToProductImageDTOs(List<ProductImage> images) {
        return images.stream()
                .map(this::mapToProductImageDTO)
                .collect(Collectors.toList());
    }
}
