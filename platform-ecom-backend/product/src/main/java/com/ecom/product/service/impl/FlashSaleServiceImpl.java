package com.ecom.product.service.impl;

import com.ecom.product.dto.FlashSaleDTO;
import com.ecom.product.dto.FlashSaleItemDTO;
import com.ecom.product.dto.request.AddFlashSaleItemRequest;
import com.ecom.product.dto.request.CreateFlashSaleRequest;
import com.ecom.product.dto.request.UpdateFlashSaleItemRequest;
import com.ecom.product.dto.request.UpdateFlashSaleRequest;
import com.ecom.product.dto.response.FlashSaleResponse;
import com.ecom.product.entity.FlashSale;
import com.ecom.product.entity.FlashSaleItem;
import com.ecom.product.enums.FlashSaleStatus;
import com.ecom.product.mapper.FlashSaleMapper;
import com.ecom.product.repository.FlashSaleItemRepository;
import com.ecom.product.repository.FlashSaleRepository;
import com.ecom.product.helper.FlashSaleItemHelper;
import com.ecom.product.helper.FlashSaleStatusHelper;
import com.ecom.product.service.signature.FlashSaleService;
import com.ecom.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecom.common.service.FileStorageService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FlashSaleServiceImpl implements FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;
    private final FlashSaleMapper flashSaleMapper;

    // Helpers
    private final FlashSaleStatusHelper statusHelper;
    private final FlashSaleItemHelper itemHelper;
    private final FileStorageService fileStorageService;

    // ==================== CRUD Operations ====================

    @Override
    public FlashSaleDTO createFlashSale(CreateFlashSaleRequest request) {
        statusHelper.validateTimeRange(request.getStartTime(), request.getEndTime());

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
            itemHelper.addItemsToFlashSale(flashSale, request.getItems());
        }

        log.info("Created flash sale: {} with {} items", flashSale.getId(),
                flashSale.getItems() != null ? flashSale.getItems().size() : 0);

        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO updateFlashSale(Long id, UpdateFlashSaleRequest request) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(id);

        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify an active flash sale");
        }

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
            statusHelper.validateTimeRange(request.getStartTime(), request.getEndTime());
            flashSale.setStartTime(request.getStartTime());
            flashSale.setEndTime(request.getEndTime());
        }

        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public void deleteFlashSale(Long id) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(id);

        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot delete an active flash sale. Cancel it first.");
        }

        flashSale.setDeleted(true);
        flashSaleRepository.save(flashSale);
        log.info("Deleted flash sale: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public FlashSaleDTO getFlashSaleById(Long id) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(id);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    @Transactional(readOnly = true)
    public FlashSaleResponse getAllFlashSales(int page, int size, String status, String sortBy, String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder != null ? sortOrder : "desc"),
                sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<FlashSale> flashSalesPage;
        if (status != null && !status.isEmpty()) {
            FlashSaleStatus flashSaleStatus = FlashSaleStatus.valueOf(status.toUpperCase());
            flashSalesPage = flashSaleRepository.findByStatusAndDeletedFalse(flashSaleStatus, pageable);
        } else {
            flashSalesPage = flashSaleRepository.findByDeletedFalse(pageable);
        }

        Page<FlashSaleDTO> dtoPage = flashSalesPage.map(fs -> flashSaleMapper.toDTO(fs, false));
        return FlashSaleResponse.from(dtoPage);
    }

    // ==================== Item Management ====================

    @Override
    public FlashSaleDTO addItems(Long flashSaleId, List<AddFlashSaleItemRequest> items) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(flashSaleId);

        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot add items to an active flash sale");
        }

        itemHelper.addItemsToFlashSale(flashSale, items);
        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO removeItem(Long flashSaleId, Long itemId) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(flashSaleId);

        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot remove items from an active flash sale");
        }

        FlashSaleItem item = itemHelper.findItemById(itemId);
        flashSale.removeItem(item);
        flashSaleItemRepository.delete(item);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO updateItem(Long flashSaleId, Long itemId, UpdateFlashSaleItemRequest request) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(flashSaleId);
        FlashSaleItem item = itemHelper.findItemById(itemId);

        if (request.getFlashSalePrice() != null) {
            item.setFlashSalePrice(request.getFlashSalePrice());
        }
        if (request.getStockLimit() != null) {
            item.setStockLimit(request.getStockLimit());
        }
        if (request.getSortOrder() != null) {
            item.setSortOrder(request.getSortOrder());
        }

        flashSaleItemRepository.save(item);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    // ==================== Public Queries ====================

    @Override
    @Transactional(readOnly = true)
    public List<FlashSaleDTO> getActiveFlashSales() {
        LocalDateTime now = LocalDateTime.now();
        List<FlashSale> activeFlashSales = flashSaleRepository.findActiveFlashSales(now);
        return activeFlashSales.stream()
                .map(fs -> flashSaleMapper.toDTO(fs, true))
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

        List<FlashSaleItem> items = flashSaleItemRepository.findByFlashSaleIdOrderBySortOrderAsc(flashSale.getId());

        if (limit > 0 && items.size() > limit) {
            items = items.subList(0, limit);
        }

        return flashSaleMapper.toItemDTOList(items);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FlashSaleItemDTO> getActiveFlashSalePrice(Long variantId) {
        return itemHelper.getActiveFlashSaleForVariant(variantId)
                .map(flashSaleMapper::toItemDTO);
    }

    // ==================== Status Management ====================

    @Override
    public FlashSaleDTO activateFlashSale(Long id) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(id);
        flashSale = statusHelper.activate(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO cancelFlashSale(Long id) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(id);
        flashSale = statusHelper.cancel(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public void updateFlashSaleStatuses() {
        statusHelper.updateScheduledStatuses();
    }

    @Override
    public boolean decrementFlashSaleStock(Long variantId, int quantity) {
        return itemHelper.decrementStock(variantId, quantity);
    }

    // ==================== Banner Upload ====================

    @Override
    public FlashSaleDTO uploadBanner(Long id, MultipartFile file) {
        FlashSale flashSale = statusHelper.findFlashSaleOrThrow(id);

        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot update banner for an active flash sale");
        }

        // Delete old banner if exists
        if (flashSale.getBannerUrl() != null && !flashSale.getBannerUrl().isEmpty()) {
            fileStorageService.deleteFile(flashSale.getBannerUrl());
        }

        // Store new banner
        String bannerUrl = fileStorageService.storeFile(file);
        flashSale.setBannerUrl(bannerUrl);
        flashSale = flashSaleRepository.save(flashSale);

        log.info("Uploaded banner for flash sale {}: {}", id, bannerUrl);
        return flashSaleMapper.toDTO(flashSale, true);
    }
}
