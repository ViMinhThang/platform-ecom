package com.ecom.product.service.impl;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.common.service.FileStorageService;
import com.ecom.product.dto.SaleCampaignDTO;
import com.ecom.product.dto.SaleCampaignItemDTO;
import com.ecom.product.dto.request.CreateSaleCampaignRequest;
import com.ecom.product.dto.request.DiscountTierRequest;
import com.ecom.product.dto.request.UpdateSaleCampaignRequest;
import com.ecom.product.dto.response.SaleCampaignResponse;
import com.ecom.product.entity.*;
import com.ecom.product.enums.SaleCampaignStatus;
import com.ecom.product.helper.SaleCampaignItemGenerator;
import com.ecom.product.mapper.SaleCampaignMapper;
import com.ecom.product.repository.*;
import com.ecom.product.service.signature.SaleCampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
public class SaleCampaignServiceImpl implements SaleCampaignService {

    private final SaleCampaignRepository saleCampaignRepository;
    private final SaleCampaignItemRepository saleCampaignItemRepository;
    private final SaleCampaignCategoryRepository saleCampaignCategoryRepository;
    private final SaleCampaignDiscountTierRepository discountTierRepository;
    private final CategoryRepository categoryRepository;
    private final SaleCampaignMapper saleCampaignMapper;
    private final SaleCampaignItemGenerator itemGenerator;
    private final FileStorageService fileStorageService;

    // ==================== CRUD Operations ====================

    @Override
    public SaleCampaignDTO createSaleCampaign(CreateSaleCampaignRequest request) {
        validateTimeRange(request.getStartTime(), request.getEndTime());

        // Create campaign
        SaleCampaign saleCampaign = SaleCampaign.builder()
                .name(request.getName())
                .description(request.getDescription())
                .bannerUrl(request.getBannerUrl())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(SaleCampaignStatus.DRAFT)
                .build();

        saleCampaign = saleCampaignRepository.save(saleCampaign);

        // Add categories
        addCategoriesToCampaign(saleCampaign, request.getCategoryIds());

        // Add discount tiers
        addDiscountTiersToCampaign(saleCampaign, request.getDiscountTiers());

        saleCampaign = saleCampaignRepository.save(saleCampaign);

        log.info("Created sale campaign: {} with {} categories and {} tiers",
                saleCampaign.getId(),
                saleCampaign.getCategories().size(),
                saleCampaign.getDiscountTiers().size());

        return saleCampaignMapper.toDTO(saleCampaign, false);
    }

    @Override
    public SaleCampaignDTO updateSaleCampaign(Long id, UpdateSaleCampaignRequest request) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);

        if (saleCampaign.getStatus() == SaleCampaignStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify an active sale campaign");
        }

        if (request.getName() != null) {
            saleCampaign.setName(request.getName());
        }
        if (request.getDescription() != null) {
            saleCampaign.setDescription(request.getDescription());
        }
        if (request.getBannerUrl() != null) {
            saleCampaign.setBannerUrl(request.getBannerUrl());
        }
        if (request.getStartTime() != null && request.getEndTime() != null) {
            validateTimeRange(request.getStartTime(), request.getEndTime());
            saleCampaign.setStartTime(request.getStartTime());
            saleCampaign.setEndTime(request.getEndTime());
        }

        saleCampaign = saleCampaignRepository.save(saleCampaign);
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    @Override
    public void deleteSaleCampaign(Long id) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);

        if (saleCampaign.getStatus() == SaleCampaignStatus.ACTIVE) {
            throw new IllegalStateException("Cannot delete an active sale campaign. Cancel it first.");
        }

        saleCampaign.setDeleted(true);
        saleCampaignRepository.save(saleCampaign);
        log.info("Deleted sale campaign: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleCampaignDTO getSaleCampaignById(Long id) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleCampaignResponse getAllSaleCampaigns(int page, int size, String status, String sortBy,
            String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder != null ? sortOrder : "desc"),
                sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SaleCampaign> campaignsPage;
        if (status != null && !status.isEmpty()) {
            SaleCampaignStatus campaignStatus = SaleCampaignStatus.valueOf(status.toUpperCase());
            campaignsPage = saleCampaignRepository.findByStatusAndDeletedFalse(campaignStatus, pageable);
        } else {
            campaignsPage = saleCampaignRepository.findByDeletedFalse(pageable);
        }

        Page<SaleCampaignDTO> dtoPage = campaignsPage.map(c -> saleCampaignMapper.toDTO(c, false));
        return SaleCampaignResponse.from(dtoPage);
    }

    // ==================== Category Management ====================

    @Override
    public SaleCampaignDTO updateCategories(Long id, List<Long> categoryIds) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);

        if (saleCampaign.getStatus() == SaleCampaignStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify categories of an active campaign");
        }

        // Clear existing categories and flush to ensure delete happens first
        saleCampaign.getCategories().clear();
        saleCampaignRepository.saveAndFlush(saleCampaign);

        // Add new categories
        addCategoriesToCampaign(saleCampaign, categoryIds);

        saleCampaign = saleCampaignRepository.save(saleCampaign);
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    // ==================== Discount Tier Management ====================

    @Override
    public SaleCampaignDTO updateDiscountTiers(Long id, List<DiscountTierRequest> tiers) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);

        if (saleCampaign.getStatus() == SaleCampaignStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify discount tiers of an active campaign");
        }

        saleCampaign.getDiscountTiers().clear();
        saleCampaignRepository.saveAndFlush(saleCampaign);

        addDiscountTiersToCampaign(saleCampaign, tiers);

        saleCampaign = saleCampaignRepository.save(saleCampaign);
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    // ==================== Item Preview ====================

    @Override
    @Transactional(readOnly = true)
    public List<SaleCampaignItemDTO> previewItems(Long id) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);

        List<SaleCampaignItem> items = itemGenerator.generateItems(saleCampaign);

        return saleCampaignMapper.toItemDTOList(items);
    }

    // ==================== Status Management ====================

    @Override
    public SaleCampaignDTO activateSaleCampaign(Long id) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);

        if (saleCampaign.getCategories().isEmpty()) {
            throw new IllegalStateException("Cannot activate a campaign without categories");
        }

        if (saleCampaign.getDiscountTiers().isEmpty()) {
            throw new IllegalStateException("Cannot activate a campaign without discount tiers");
        }

        // Clear existing items
        saleCampaign.getItems().clear();
        saleCampaignItemRepository.deleteBySaleCampaignId(id);

        // Generate new items
        List<SaleCampaignItem> items = itemGenerator.generateItems(saleCampaign);

        if (items.isEmpty()) {
            throw new IllegalStateException("No products match the selected categories and discount tiers");
        }

        // Add items to campaign
        items.forEach(saleCampaign::addItem);

        // Determine status based on time
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(saleCampaign.getStartTime())) {
            saleCampaign.setStatus(SaleCampaignStatus.ACTIVE);
        } else {
            saleCampaign.setStatus(SaleCampaignStatus.SCHEDULED);
        }

        saleCampaign = saleCampaignRepository.save(saleCampaign);

        log.info("Activated campaign {} with {} items, status: {}",
                id, items.size(), saleCampaign.getStatus());

        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    @Override
    public SaleCampaignDTO cancelSaleCampaign(Long id) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);
        saleCampaign.setStatus(SaleCampaignStatus.CANCELLED);
        saleCampaign = saleCampaignRepository.save(saleCampaign);

        log.info("Cancelled campaign: {}", id);
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    @Override
    public void updateSaleCampaignStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Activate scheduled campaigns
        List<SaleCampaign> toActivate = saleCampaignRepository.findScheduledCampaignsToActivate(now);
        for (SaleCampaign campaign : toActivate) {
            campaign.setStatus(SaleCampaignStatus.ACTIVE);
            saleCampaignRepository.save(campaign);
            log.info("Auto-activated campaign: {}", campaign.getId());
        }

        // End active campaigns
        List<SaleCampaign> toEnd = saleCampaignRepository.findActiveCampaignsToEnd(now);
        for (SaleCampaign campaign : toEnd) {
            campaign.setStatus(SaleCampaignStatus.ENDED);
            saleCampaignRepository.save(campaign);
            log.info("Auto-ended campaign: {}", campaign.getId());
        }
    }

    // ==================== Public Queries ====================

    @Override
    @Transactional(readOnly = true)
    public List<SaleCampaignDTO> getActiveSaleCampaigns() {
        LocalDateTime now = LocalDateTime.now();
        List<SaleCampaign> activeCampaigns = saleCampaignRepository.findActiveCampaigns(now);
        return activeCampaigns.stream()
                .map(c -> saleCampaignMapper.toDTO(c, true))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SaleCampaignDTO getSaleCampaignBySlug(String slug) {
        SaleCampaign saleCampaign = saleCampaignRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Sale campaign not found: " + slug));
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleCampaignItemDTO> getSaleCampaignItems(String slug, int limit) {
        SaleCampaign saleCampaign = saleCampaignRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Sale campaign not found: " + slug));

        List<SaleCampaignItem> items = saleCampaignItemRepository
                .findBySaleCampaignIdOrderBySortOrderAsc(saleCampaign.getId());

        if (limit > 0 && items.size() > limit) {
            items = items.subList(0, limit);
        }

        return saleCampaignMapper.toItemDTOList(items);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SaleCampaignItemDTO> getActiveSalePrice(Long variantId) {
        return saleCampaignItemRepository.findActiveSaleForVariant(variantId)
                .map(saleCampaignMapper::toItemDTO);
    }

    @Override
    public boolean decrementSaleStock(Long variantId, int quantity) {
        Optional<SaleCampaignItem> itemOpt = saleCampaignItemRepository.findActiveSaleForVariant(variantId);
        if (itemOpt.isEmpty()) {
            return false;
        }

        SaleCampaignItem item = itemOpt.get();
        if (!item.incrementSoldCount(quantity)) {
            return false;
        }

        saleCampaignItemRepository.save(item);
        return true;
    }

    // ==================== Banner Upload ====================

    @Override
    public SaleCampaignDTO uploadBanner(Long id, MultipartFile file) {
        SaleCampaign saleCampaign = findCampaignOrThrow(id);

        if (saleCampaign.getStatus() == SaleCampaignStatus.ACTIVE) {
            throw new IllegalStateException("Cannot update banner for an active campaign");
        }

        // Delete old banner if exists
        if (saleCampaign.getBannerUrl() != null && !saleCampaign.getBannerUrl().isEmpty()) {
            fileStorageService.deleteFile(saleCampaign.getBannerUrl());
        }

        // Store new banner
        String bannerUrl = fileStorageService.storeFile(file);
        saleCampaign.setBannerUrl(bannerUrl);
        saleCampaign = saleCampaignRepository.save(saleCampaign);

        log.info("Uploaded banner for campaign {}: {}", id, bannerUrl);
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    // ==================== Helper Methods ====================

    private SaleCampaign findCampaignOrThrow(Long id) {
        return saleCampaignRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale campaign not found: " + id));
    }

    private void validateTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime.isBefore(startTime) || endTime.isEqual(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
    }

    private void addCategoriesToCampaign(SaleCampaign saleCampaign, List<Long> categoryIds) {
        for (Long categoryId : categoryIds) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));

            SaleCampaignCategory campaignCategory = SaleCampaignCategory.builder()
                    .saleCampaign(saleCampaign)
                    .category(category)
                    .build();

            saleCampaign.addCategory(campaignCategory);
        }
    }

    private void addDiscountTiersToCampaign(SaleCampaign saleCampaign, List<DiscountTierRequest> tierRequests) {
        int sortOrder = 0;
        for (DiscountTierRequest tierReq : tierRequests) {
            // Validate tier
            if (tierReq.getMinPrice().compareTo(tierReq.getMaxPrice()) > 0) {
                throw new IllegalArgumentException("Min price cannot be greater than max price");
            }

            SaleCampaignDiscountTier tier = SaleCampaignDiscountTier.builder()
                    .saleCampaign(saleCampaign)
                    .minPrice(tierReq.getMinPrice())
                    .maxPrice(tierReq.getMaxPrice())
                    .discountPercent(tierReq.getDiscountPercent())
                    .sortOrder(tierReq.getSortOrder() != null ? tierReq.getSortOrder() : sortOrder++)
                    .build();

            saleCampaign.addDiscountTier(tier);
        }
    }
}
