package com.ecom.product.service.impl;

import com.ecom.common.service.FileStorageService;
import com.ecom.product.dto.DescriptionImageDTO;
import com.ecom.product.entity.DescriptionImage;
import com.ecom.product.entity.Product;
import com.ecom.product.helper.DescriptionImageHelper;
import com.ecom.product.helper.ProductHelper;
import com.ecom.product.repository.DescriptionImageRepository;
import com.ecom.product.service.signature.DescriptionImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DescriptionImageServiceImpl implements DescriptionImageService {

    private final DescriptionImageRepository descriptionImageRepository;
    private final FileStorageService fileStorageService;
    private final ModelMapper modelMapper;
    private final ProductHelper productHelper;
    private final DescriptionImageHelper descriptionImageHelper;

    @Override
    @Transactional
    public DescriptionImageDTO uploadImage(Long productId, MultipartFile file) {
        Product product = productHelper.findByIdOrThrow(productId);

        String imageUrl = fileStorageService.storeFile(file);

        DescriptionImage descriptionImage = DescriptionImage.builder()
                .product(product)
                .imageUrl(imageUrl)
                .build();

        DescriptionImage saved = descriptionImageRepository.save(descriptionImage);

        DescriptionImageDTO dto = modelMapper.map(saved, DescriptionImageDTO.class);
        dto.setProductId(productId);
        return dto;
    }

    @Override
    @Transactional
    public void markAsDeleted(Long productId, Long imageId) {
        DescriptionImage image = descriptionImageHelper.findByProductIdAndIdOrThrow(productId, imageId);

        image.setDeleted(true);
        image.setDeletedAt(LocalDateTime.now());
        descriptionImageRepository.save(image);
        log.info("Marked description image {} as deleted for product {}", imageId, productId);
    }

    @Override
    @Scheduled(cron = "0 0 2 * * *") // Run daily at 2 AM
    @Transactional
    public void cleanupDeletedImages() {
        LocalDateTime cutOff = LocalDateTime.now().minusHours(24);
        List<DescriptionImage> toDelete = descriptionImageRepository.findByDeletedTrueAndDeletedAtBefore(cutOff);

        log.info("Starting cleanup of {} deleted description images", toDelete.size());

        for (DescriptionImage image : toDelete) {
            try {
                fileStorageService.deleteFile(image.getImageUrl());
                descriptionImageRepository.delete(image);
                log.info("Permanently deleted description image {}", image.getId());
            } catch (Exception e) {
                log.error("Failed to delete description image file {}: {}", image.getImageUrl(), e.getMessage());
            }
        }
    }
}
