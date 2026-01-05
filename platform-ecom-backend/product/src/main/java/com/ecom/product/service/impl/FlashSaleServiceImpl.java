package com.ecom.product.service.impl;

import com.ecom.product.dto.FlashSaleDTO;
import com.ecom.product.dto.FlashSaleItemDTO;
import com.ecom.product.dto.FlashSaleResponse;
import com.ecom.product.dto.request.AddFlashSaleItemRequest;
import com.ecom.product.dto.request.CreateFlashSaleRequest;
import com.ecom.product.dto.request.UpdateFlashSaleItemRequest;
import com.ecom.product.dto.request.UpdateFlashSaleRequest;
import com.ecom.product.entity.FlashSale;
import com.ecom.product.entity.FlashSaleItem;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.enums.FlashSaleStatus;
import com.ecom.product.mapper.FlashSaleMapper;
import com.ecom.product.repository.FlashSaleItemRepository;
import com.ecom.product.repository.FlashSaleRepository;
import com.ecom.product.repository.ProductVariantRepository;
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
    private final ProductVariantRepository productVariantRepository;
    private final FlashSaleMapper flashSaleMapper;

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
            addItemsToFlashSale(flashSale, request.getItems());
        }

        log.info("Created flash sale: {} with {} items", flashSale.getId(),
                flashSale.getItems() != null ? flashSale.getItems().size() : 0);

        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO updateFlashSale(Long id, UpdateFlashSaleRequest request) {
        FlashSale flashSale = findFlashSaleOrThrow(id);

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
            validateTimeRange(request.getStartTime(), request.getEndTime());
            flashSale.setStartTime(request.getStartTime());
            flashSale.setEndTime(request.getEndTime());
        }

        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public void deleteFlashSale(Long id) {
        FlashSale flashSale = findFlashSaleOrThrow(id);

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
        FlashSale flashSale = findFlashSaleOrThrow(id);
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

    @Override
    public FlashSaleDTO addItems(Long flashSaleId, List<AddFlashSaleItemRequest> items) {
        FlashSale flashSale = findFlashSaleOrThrow(flashSaleId);

        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot add items to an active flash sale");
        }

        addItemsToFlashSale(flashSale, items);
        flashSale = flashSaleRepository.save(flashSale);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO removeItem(Long flashSaleId, Long itemId) {
        FlashSale flashSale = findFlashSaleOrThrow(flashSaleId);

        if (flashSale.getStatus() == FlashSaleStatus.ACTIVE) {
            throw new IllegalStateException("Cannot remove items from an active flash sale");
        }

        FlashSaleItem item = flashSaleItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale item not found"));

        flashSale.removeItem(item);
        flashSaleItemRepository.delete(item);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO updateItem(Long flashSaleId, Long itemId, UpdateFlashSaleItemRequest request) {
        FlashSale flashSale = findFlashSaleOrThrow(flashSaleId);

        FlashSaleItem item = flashSaleItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale item not found"));

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
        return flashSaleItemRepository.findActiveFlashSaleForVariant(variantId)
                .map(flashSaleMapper::toItemDTO);
    }

    @Override
    public FlashSaleDTO activateFlashSale(Long id) {
        FlashSale flashSale = findFlashSaleOrThrow(id);

        if (flashSale.getStatus() != FlashSaleStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT flash sales can be activated");
        }

        if (flashSale.getItems() == null || flashSale.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot activate flash sale without items");
        }

        if (flashSale.getStartTime().isBefore(LocalDateTime.now())) {
            flashSale.setStatus(FlashSaleStatus.ACTIVE);
        } else {
            flashSale.setStatus(FlashSaleStatus.SCHEDULED);
        }

        flashSale = flashSaleRepository.save(flashSale);
        log.info("Activated flash sale: {} with status: {}", id, flashSale.getStatus());
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public FlashSaleDTO cancelFlashSale(Long id) {
        FlashSale flashSale = findFlashSaleOrThrow(id);

        if (flashSale.getStatus() == FlashSaleStatus.ENDED ||
                flashSale.getStatus() == FlashSaleStatus.CANCELLED) {
            throw new IllegalStateException("Flash sale is already ended or cancelled");
        }

        flashSale.setStatus(FlashSaleStatus.CANCELLED);
        flashSale = flashSaleRepository.save(flashSale);
        log.info("Cancelled flash sale: {}", id);
        return flashSaleMapper.toDTO(flashSale, true);
    }

    @Override
    public void updateFlashSaleStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Activate scheduled flash sales
        List<FlashSale> toActivate = flashSaleRepository.findScheduledFlashSalesToActivate(now);
        for (FlashSale fs : toActivate) {
            fs.setStatus(FlashSaleStatus.ACTIVE);
            flashSaleRepository.save(fs);
            log.info("Auto-activated flash sale: {}", fs.getId());
        }

        // End expired flash sales
        List<FlashSale> toEnd = flashSaleRepository.findActiveFlashSalesToEnd(now);
        for (FlashSale fs : toEnd) {
            fs.setStatus(FlashSaleStatus.ENDED);
            flashSaleRepository.save(fs);
            log.info("Auto-ended flash sale: {}", fs.getId());
        }
    }

    @Override
    public boolean decrementFlashSaleStock(Long variantId, int quantity) {
        Optional<FlashSaleItem> itemOpt = flashSaleItemRepository.findActiveFlashSaleForVariant(variantId);
        if (itemOpt.isEmpty()) {
            return false;
        }

        FlashSaleItem item = itemOpt.get();
        if (!item.incrementSoldCount(quantity)) {
            return false;
        }

        flashSaleItemRepository.save(item);
        return true;
    }

    // ==================== Private Helper Methods ====================

    private FlashSale findFlashSaleOrThrow(Long id) {
        return flashSaleRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found: " + id));
    }

    private void validateTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in the future");
        }
    }

    private void addItemsToFlashSale(FlashSale flashSale, List<AddFlashSaleItemRequest> itemRequests) {
        for (AddFlashSaleItemRequest itemReq : itemRequests) {
            ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + itemReq.getVariantId()));

            // Check for overlapping flash sales
            if (flashSale.getId() != null) {
                boolean hasOverlap = flashSaleRepository.existsOverlappingFlashSaleExcluding(
                        variant.getId(),
                        flashSale.getStartTime(),
                        flashSale.getEndTime(),
                        flashSale.getId());
                if (hasOverlap) {
                    throw new IllegalArgumentException("Variant " + variant.getSku() +
                            " is already in another flash sale during this time period");
                }
            }

            // Validate stock limit
            if (itemReq.getStockLimit() > variant.getStock()) {
                throw new IllegalArgumentException("Stock limit exceeds available stock for variant: " + variant.getSku());
            }

            FlashSaleItem item = FlashSaleItem.builder()
                    .flashSale(flashSale)
                    .variant(variant)
                    .flashSalePrice(itemReq.getFlashSalePrice())
                    .stockLimit(itemReq.getStockLimit())
                    .sortOrder(itemReq.getSortOrder() != null ? itemReq.getSortOrder() : 0)
                    .build();

            flashSale.addItem(item);
        }
    }
}
