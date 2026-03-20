package com.ecom.product.service.impl;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.common.service.FileStorageService;
import com.ecom.product.dto.FlashSaleDTO;
import com.ecom.product.dto.FlashSaleItemDTO;
import com.ecom.product.dto.request.AddFlashSaleItemRequest;
import com.ecom.product.dto.request.CreateFlashSaleRequest;
import com.ecom.product.dto.request.UpdateFlashSaleItemRequest;
import com.ecom.product.dto.request.UpdateFlashSaleRequest;
import com.ecom.product.dto.response.FlashSaleResponse;
import com.ecom.product.entity.FlashSale;
import com.ecom.product.entity.FlashSaleItem;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.enums.FlashSaleStatus;
import com.ecom.product.mapper.FlashSaleMapper;
import com.ecom.product.repository.FlashSaleRepository;
import com.ecom.product.repository.ProductVariantRepository;
import com.ecom.product.service.signature.FlashSaleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FlashSaleServiceImpl implements FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final ProductVariantRepository productVariantRepository;
    private final FlashSaleMapper flashSaleMapper;
    private final FileStorageService fileStorageService;

    @Override
    public FlashSaleDTO createFlashSale(CreateFlashSaleRequest request) {
        validateTimeRange(request.getStartTime(), request.getEndTime());

        FlashSale flashSale = FlashSale.builder()
                .name(request.getName())
                .description(request.getDescription())
                .bannerUrl(request.getBannerUrl())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(FlashSaleStatus.DRAFT)
                .build();

        flashSale = flashSaleRepository.save(flashSale);

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            addItemsInternal(flashSale, request.getItems());
        }

        log.info("Created flash sale: {} with {} items", flashSale.getId(),
                flashSale.getItems() != null ? flashSale.getItems().size() : 0);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO updateFlashSale(Long id, UpdateFlashSaleRequest request) {
        FlashSale flashSale = findByIdOrThrow(id);
        validateModification(flashSale);

        if (request.getName() != null) {
            flashSale.setName(request.getName());
        }
        if (request.getDescription() != null) {
            flashSale.setDescription(request.getDescription());
        }
        if (request.getBannerUrl() != null) {
            flashSale.setBannerUrl(request.getBannerUrl());
        }
        if (request.getStartTime() != null && request.getEndTime() != null) {
            validateTimeRange(request.getStartTime(), request.getEndTime());
            flashSale.setStartTime(request.getStartTime());
            flashSale.setEndTime(request.getEndTime());
        }
        if (request.getStatus() != null) {
            flashSale.setStatus(FlashSaleStatus.valueOf(request.getStatus()));
        }

        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public void deleteFlashSale(Long id) {
        FlashSale flashSale = findByIdOrThrow(id);
        flashSale.setDeleted(true);
        flashSaleRepository.save(flashSale);
        log.info("Deleted flash sale: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public FlashSaleDTO getFlashSaleById(Long id) {
        FlashSale flashSale = flashSaleRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found: " + id));
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    @Transactional(readOnly = true)
    public FlashSaleResponse getAllFlashSales(int page, int size, String status, String sortBy, String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder != null ? sortOrder : "desc"),
                sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<FlashSale> flashSalesPage = (status != null && !status.isEmpty())
                ? flashSaleRepository.findByStatusAndDeletedFalse(
                        FlashSaleStatus.valueOf(status.toUpperCase()), pageable)
                : flashSaleRepository.findByDeletedFalse(pageable);

        return FlashSaleResponse.from(flashSalesPage.map(f -> flashSaleMapper.toDTO(f, false)));
    }

    @Override
    public FlashSaleDTO addItems(Long flashSaleId, List<AddFlashSaleItemRequest> items) {
        FlashSale flashSale = findByIdOrThrow(flashSaleId);
        validateModification(flashSale);

        addItemsInternal(flashSale, items);

        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO removeItem(Long flashSaleId, Long itemId) {
        FlashSale flashSale = findByIdOrThrow(flashSaleId);
        validateModification(flashSale);

        flashSale.getItems().removeIf(item -> item.getId().equals(itemId));
        flashSale = flashSaleRepository.save(flashSale);

        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO updateItem(Long flashSaleId, Long itemId, UpdateFlashSaleItemRequest request) {
        FlashSale flashSale = findByIdOrThrow(flashSaleId);
        validateModification(flashSale);

        FlashSaleItem item = flashSale.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale item not found: " + itemId));

        if (request.getFlashSalePrice() != null) {
            item.setFlashSalePrice(request.getFlashSalePrice());
        }
        if (request.getStockLimit() != null) {
            item.setStockLimit(request.getStockLimit());
        }
        if (request.getSortOrder() != null) {
            item.setSortOrder(request.getSortOrder());
        }

        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlashSaleDTO> getActiveFlashSales() {
        return flashSaleRepository.findActiveFlashSales(FlashSaleStatus.ACTIVE, LocalDateTime.now()).stream()
                .map(f -> flashSaleMapper.toDTO(f, true))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FlashSaleDTO getFlashSaleBySlug(String slug) {
        FlashSale flashSale = flashSaleRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found: " + slug));
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlashSaleItemDTO> getFlashSaleItems(String slug, int limit) {
        FlashSale flashSale = flashSaleRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found: " + slug));
        return flashSale.getItems().stream()
                .sorted((a, b) -> Integer.compare(
                        a.getSortOrder() != null ? a.getSortOrder() : 0,
                        b.getSortOrder() != null ? b.getSortOrder() : 0))
                .limit(limit)
                .map(flashSaleMapper::toItemDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FlashSaleItemDTO> getActiveFlashSalePrice(Long variantId) {
        LocalDateTime now = LocalDateTime.now();
        return flashSaleRepository.findActiveFlashSales(FlashSaleStatus.ACTIVE, now).stream()
                .flatMap(fs -> fs.getItems().stream())
                .filter(item -> item.getVariant() != null && item.getVariant().getId().equals(variantId))
                .map(flashSaleMapper::toItemDTO)
                .findFirst();
    }

    @Override
    public FlashSaleDTO activateFlashSale(Long id) {
        FlashSale flashSale = findByIdOrThrow(id);
        validateActivation(flashSale);

        flashSale.setStatus(LocalDateTime.now().isAfter(flashSale.getStartTime())
                ? FlashSaleStatus.ACTIVE
                : FlashSaleStatus.SCHEDULED);

        flashSale = flashSaleRepository.save(flashSale);
        log.info("Activated flash sale: {}", id);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO cancelFlashSale(Long id) {
        FlashSale flashSale = findByIdOrThrow(id);
        flashSale.setStatus(FlashSaleStatus.CANCELLED);
        flashSale = flashSaleRepository.save(flashSale);
        log.info("Cancelled flash sale: {}", id);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public void updateFlashSaleStatuses() {
        LocalDateTime now = LocalDateTime.now();

        flashSaleRepository.findByStatusAndDeletedFalse(FlashSaleStatus.SCHEDULED,
                        PageRequest.of(0, 100))
                .forEach(fs -> {
                    if (now.isAfter(fs.getStartTime()) && now.isBefore(fs.getEndTime())) {
                        fs.setStatus(FlashSaleStatus.ACTIVE);
                        flashSaleRepository.save(fs);
                    } else if (now.isAfter(fs.getEndTime())) {
                        fs.setStatus(FlashSaleStatus.ENDED);
                        flashSaleRepository.save(fs);
                    }
                });

        flashSaleRepository.findByStatusAndDeletedFalse(FlashSaleStatus.ACTIVE,
                        PageRequest.of(0, 100))
                .forEach(fs -> {
                    if (now.isAfter(fs.getEndTime())) {
                        fs.setStatus(FlashSaleStatus.ENDED);
                        flashSaleRepository.save(fs);
                    }
                });
    }

    @Override
    public boolean decrementFlashSaleStock(Long variantId, int quantity) {
        LocalDateTime now = LocalDateTime.now();
        return flashSaleRepository.findActiveFlashSales(FlashSaleStatus.ACTIVE, now).stream()
                .flatMap(fs -> fs.getItems().stream())
                .filter(item -> item.getVariant() != null && item.getVariant().getId().equals(variantId))
                .findFirst()
                .map(item -> {
                    if (!item.incrementSoldCount(quantity)) {
                        return false;
                    }
                    flashSaleRepository.save(item.getFlashSale());
                    return true;
                })
                .orElse(false);
    }

    @Override
    public FlashSaleDTO uploadBanner(Long id, MultipartFile file) {
        FlashSale flashSale = findByIdOrThrow(id);
        validateModification(flashSale);

        if (flashSale.getBannerUrl() != null && !flashSale.getBannerUrl().isEmpty()) {
            fileStorageService.deleteFile(flashSale.getBannerUrl());
        }

        flashSale.setBannerUrl(fileStorageService.storeFile(file));
        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    private FlashSale findByIdOrThrow(Long id) {
        return flashSaleRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found: " + id));
    }

    private void validateTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
    }

    private void validateModification(FlashSale flashSale) {
        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify an active flash sale");
        }
        if (flashSale.getStatus() == FlashSaleStatus.ENDED) {
            throw new IllegalStateException("Cannot modify an ended flash sale");
        }
    }

    private void validateActivation(FlashSale flashSale) {
        if (flashSale.getStatus() != FlashSaleStatus.DRAFT &&
                flashSale.getStatus() != FlashSaleStatus.SCHEDULED) {
            throw new IllegalStateException("Can only activate DRAFT or SCHEDULED flash sales");
        }
        if (flashSale.getItems() == null || flashSale.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot activate a flash sale with no items");
        }
    }

    private void addItemsInternal(FlashSale flashSale, List<AddFlashSaleItemRequest> items) {
        int sortOrder = flashSale.getItems() != null ? flashSale.getItems().size() : 0;
        for (AddFlashSaleItemRequest itemRequest : items) {
            ProductVariant variant = productVariantRepository.findById(itemRequest.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + itemRequest.getVariantId()));

            FlashSaleItem item = FlashSaleItem.builder()
                    .flashSale(flashSale)
                    .variant(variant)
                    .flashSalePrice(itemRequest.getFlashSalePrice())
                    .stockLimit(itemRequest.getStockLimit())
                    .soldCount(0)
                    .sortOrder(itemRequest.getSortOrder() != null ? itemRequest.getSortOrder() : sortOrder++)
                    .build();

            flashSale.addItem(item);
        }
    }
}
