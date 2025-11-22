package com.ecom.product.service;

import com.ecom.product.dto.ProductImageDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductImage;
import com.ecom.product.exceptions.ResourceNotFoundException;
import com.ecom.product.repository.ProductImageRepository;
import com.ecom.product.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileStorageService fileStorageService; 

    @Override
    public ProductImageDTO addImageToProduct(Long productId, MultipartFile image) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        String imageUrl = fileStorageService.storeFile(image);

        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setImageUrl(imageUrl);

        ProductImage savedImage = productImageRepository.save(productImage);
        return modelMapper.map(savedImage, ProductImageDTO.class);
    }

    @Override
    public List<ProductImageDTO> getProductImages(Long productId) {
        List<ProductImage> images = productImageRepository.findByProductId(productId);
        return images.stream()
                .map(image -> modelMapper.map(image, ProductImageDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductImageDTO getProductImageById(Long productId, Long imageId) {
        ProductImage image = productImageRepository.findByProductIdAndId(productId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "imageId", imageId));
        return modelMapper.map(image, ProductImageDTO.class);
    }

    @Override
    public ProductImageDTO updateProductImage(Long productId, Long imageId, MultipartFile imageFile) {
        ProductImage image = productImageRepository.findByProductIdAndId(productId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "imageId", imageId));

        if (imageFile != null && !imageFile.isEmpty()) {
            fileStorageService.deleteFile(image.getImageUrl());
            String newImageUrl = fileStorageService.storeFile(imageFile);
            image.setImageUrl(newImageUrl);
        }
        ProductImage updatedImage = productImageRepository.save(image);
        return modelMapper.map(updatedImage, ProductImageDTO.class);
    }

    @Override
    public void deleteProductImage(Long productId, Long imageId) {
        ProductImage image = productImageRepository.findByProductIdAndId(productId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "imageId", imageId));

        fileStorageService.deleteFile(image.getImageUrl());
        productImageRepository.delete(image);
    }
}
