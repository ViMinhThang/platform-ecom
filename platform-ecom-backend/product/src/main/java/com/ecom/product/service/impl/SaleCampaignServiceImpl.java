package com.ecom.product.service.impl;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.common.service.FileStorageService;
import com.ecom.product.dto.SaleCampaignDTO;
import com.ecom.product.dto.SaleCampaignItemDTO;
import com.ecom.product.dto.request.*;
import com.ecom.product.dto.response.SaleCampaignResponse;
import com.ecom.product.entity.*;
import com.ecom.product.enums.SaleCampaignStatus;
import com.ecom.product.helper.*;
import com.ecom.product.validator.SaleCampaignValidator;
import com.ecom.product.mapper.SaleCampaignMapper;
import com.ecom.product.repository.SaleCampaignItemRepository;
import com.ecom.product.repository.SaleCampaignRepository;
import com.ecom.product.service.signature.SaleCampaignService;
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
public class SaleCampaignServiceImpl implements SaleCampaignService {

    private final SaleCampaignRepository saleCampaignRepository;
    private final SaleCampaignItemRepository saleCampaignItemRepository;

    private final SaleCampaignMapper saleCampaignMapper;
    private final SaleCampaignItemGenerator itemGenerator;
    private final FileStorageService fileStorageService;
    private final SaleCampaignHelper saleCampaignHelper;
    private final CategoryHelper categoryHelper;
    private final SaleCampaignValidator validator;
    private final SaleCampaignVoucherHelper voucherHelper;
    private final SaleCampaignTaskService taskService;

    // ==================== CRUD Operations ====================

    @Override
    public SaleCampaignDTO createSaleCampaign(CreateSaleCampaignRequest request) {
        validator.validateTimeRange(request.getStartTime(), request.getEndTime());
        validator.validateDiscountTiers(request.getDiscountTiers());

        SaleCampaign saleCampaign = SaleCampaign.builder()
                .name(request.getName())
                .description(request.getDescription())
                .bannerUrl(request.getBannerUrl())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(SaleCampaignStatus.DRAFT)
                .build();

        saleCampaign = saleCampaignRepository.save(saleCampaign);
        addCategoriesToCampaign(saleCampaign, request.getCategoryIds());
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
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        validator.validateModification(saleCampaign);

        if (request.getName() != null)
            saleCampaign.setName(request.getName());
        if (request.getDescription() != null)
            saleCampaign.setDescription(request.getDescription());
        if (request.getBannerUrl() != null)
            saleCampaign.setBannerUrl(request.getBannerUrl());

        if (request.getStartTime() != null && request.getEndTime() != null) {
            validator.validateTimeRange(request.getStartTime(), request.getEndTime());
            saleCampaign.setStartTime(request.getStartTime());
            saleCampaign.setEndTime(request.getEndTime());
        }

        return saleCampaignMapper.toDTO(saleCampaignRepository.save(saleCampaign), true);
    }

    @Override
    public void deleteSaleCampaign(Long id) {
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        validator.validateDeletion(saleCampaign);

        saleCampaign.setDeleted(true);
        saleCampaignRepository.save(saleCampaign);
        log.info("Deleted sale campaign: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleCampaignDTO getSaleCampaignById(Long id) {
        return saleCampaignMapper.toDTO(saleCampaignHelper.findByIdOrThrow(id), true);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleCampaignResponse getAllSaleCampaigns(int page, int size, String status, String sortBy,
            String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder != null ? sortOrder : "desc"),
                sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SaleCampaign> campaignsPage = (status != null && !status.isEmpty())
                ? saleCampaignRepository.findByStatusAndDeletedFalse(SaleCampaignStatus.valueOf(status.toUpperCase()),
                        pageable)
                : saleCampaignRepository.findByDeletedFalse(pageable);

        return SaleCampaignResponse.from(campaignsPage.map(c -> saleCampaignMapper.toDTO(c, false)));
    }

    // ==================== Category Management ====================

    @Override
    public SaleCampaignDTO updateCategories(Long id, List<Long> categoryIds) {
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        validator.validateModification(saleCampaign);

        saleCampaign.getCategories().clear();
        saleCampaignRepository.saveAndFlush(saleCampaign);

        addCategoriesToCampaign(saleCampaign, categoryIds);
        return saleCampaignMapper.toDTO(saleCampaignRepository.save(saleCampaign), true);
    }

    // ==================== Discount Tier Management ====================

    @Override
    public SaleCampaignDTO updateDiscountTiers(Long id, List<DiscountTierRequest> tiers) {
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        validator.validateModification(saleCampaign);
        validator.validateDiscountTiers(tiers);

        saleCampaign.getDiscountTiers().clear();
        saleCampaignRepository.saveAndFlush(saleCampaign);

        addDiscountTiersToCampaign(saleCampaign, tiers);
        return saleCampaignMapper.toDTO(saleCampaignRepository.save(saleCampaign), true);
    }

    // ==================== Item Preview ====================

    @Override
    @Transactional(readOnly = true)
    public List<SaleCampaignItemDTO> previewItems(Long id) {
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        return saleCampaignMapper.toItemDTOList(itemGenerator.generateItems(saleCampaign));
    }

    // ==================== Status Management ====================

    @Override
    public SaleCampaignDTO activateSaleCampaign(Long id) {
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        validator.validateActivation(saleCampaign);

        // Reset items
        saleCampaign.getItems().clear();
        saleCampaignItemRepository.deleteBySaleCampaignId(id);

        List<SaleCampaignItem> items = itemGenerator.generateItems(saleCampaign);
        if (items.isEmpty()) {
            log.warn("Activating campaign {} with 0 items (no products matched criteria)", id);
        }

        items.forEach(saleCampaign::addItem);

        // Determine status
        saleCampaign.setStatus(LocalDateTime.now().isAfter(saleCampaign.getStartTime())
                ? SaleCampaignStatus.ACTIVE
                : SaleCampaignStatus.SCHEDULED);

        saleCampaign = saleCampaignRepository.save(saleCampaign);
        voucherHelper.generateVouchersForCampaign(saleCampaign, items);

        log.info("Activated campaign {} with {} items", id, items.size());
        return saleCampaignMapper.toDTO(saleCampaign, true);
    }

    @Override
    public SaleCampaignDTO cancelSaleCampaign(Long id) {
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        saleCampaign.setStatus(SaleCampaignStatus.CANCELLED);
        return saleCampaignMapper.toDTO(saleCampaignRepository.save(saleCampaign), true);
    }

    @Override
    public void updateSaleCampaignStatuses() {
        taskService.updateSaleCampaignStatuses();
    }

    // ==================== Public Queries ====================

    @Override
    @Transactional(readOnly = true)
    public List<SaleCampaignDTO> getActiveSaleCampaigns() {
        return saleCampaignRepository.findActiveCampaigns(LocalDateTime.now()).stream()
                .map(c -> saleCampaignMapper.toDTO(c, true)).toList();
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
        SaleCampaign campaign = saleCampaignRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Sale campaign not found: " + slug));

        List<SaleCampaignItem> items = saleCampaignItemRepository
                .findBySaleCampaignIdOrderBySortOrderAsc(campaign.getId());
        if (limit > 0 && items.size() > limit)
            items = items.subList(0, limit);

        return saleCampaignMapper.toItemDTOList(items);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SaleCampaignItemDTO> getActiveSalePrice(Long variantId) {
        return saleCampaignItemRepository.findActiveSaleForVariant(variantId).map(saleCampaignMapper::toItemDTO);
    }

    @Override
    public boolean decrementSaleStock(Long variantId, int quantity) {
        return saleCampaignItemRepository.findActiveSaleForVariant(variantId)
                .map(item -> {
                    if (!item.incrementSoldCount(quantity))
                        return false;
                    saleCampaignItemRepository.save(item);
                    return true;
                }).orElse(false);
    }

    // ==================== Banner Upload ====================

    @Override
    public SaleCampaignDTO uploadBanner(Long id, MultipartFile file) {
        SaleCampaign saleCampaign = saleCampaignHelper.findByIdOrThrow(id);
        validator.validateModification(saleCampaign);

        if (saleCampaign.getBannerUrl() != null && !saleCampaign.getBannerUrl().isEmpty()) {
            fileStorageService.deleteFile(saleCampaign.getBannerUrl());
        }

        saleCampaign.setBannerUrl(fileStorageService.storeFile(file));
        return saleCampaignMapper.toDTO(saleCampaignRepository.save(saleCampaign), true);
    }

    // ==================== Helper Methods ====================

    private void addCategoriesToCampaign(SaleCampaign saleCampaign, List<Long> categoryIds) {
        categoryIds.forEach(id -> {
            saleCampaign.addCategory(SaleCampaignCategory.builder()
                    .saleCampaign(saleCampaign)
                    .category(categoryHelper.findByIdOrThrow(id))
                    .build());
        });
    }

    private void addDiscountTiersToCampaign(SaleCampaign saleCampaign, List<DiscountTierRequest> tierRequests) {
        int sortOrder = 0;
        for (DiscountTierRequest req : tierRequests) {
            saleCampaign.addDiscountTier(SaleCampaignDiscountTier.builder()
                    .saleCampaign(saleCampaign)
                    .minPrice(req.getMinPrice())
                    .maxPrice(req.getMaxPrice())
                    .discountPercent(req.getDiscountPercent())
                    .sortOrder(req.getSortOrder() != null ? req.getSortOrder() : sortOrder++)
                    .build());
        }
    }
}
