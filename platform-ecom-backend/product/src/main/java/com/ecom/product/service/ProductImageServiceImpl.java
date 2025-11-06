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

    @Override
    public ProductImageDTO addImageToProduct(Long productId, ProductImageDTO productImageDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        ProductImage productImage = modelMapper.map(productImageDTO, ProductImage.class);
        productImage.setProduct(product);

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
    public ProductImageDTO updateProductImage(Long productId, Long imageId, ProductImageDTO productImageDTO) {
        ProductImage image = productImageRepository.findByProductIdAndId(productId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "imageId", imageId));

        modelMapper.map(productImageDTO, image);

        ProductImage updatedImage = productImageRepository.save(image);
        return modelMapper.map(updatedImage, ProductImageDTO.class);
    }

    @Override
    public void deleteProductImage(Long productId, Long imageId) {
        ProductImage image = productImageRepository.findByProductIdAndId(productId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "imageId", imageId));
        productImageRepository.delete(image);
    }
}
