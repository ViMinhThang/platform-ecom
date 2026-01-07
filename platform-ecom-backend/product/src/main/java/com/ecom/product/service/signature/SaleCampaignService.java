package com.ecom.product.service.signature;

import com.ecom.product.dto.SaleCampaignDTO;
import com.ecom.product.dto.SaleCampaignItemDTO;
import com.ecom.product.dto.request.CreateSaleCampaignRequest;
import com.ecom.product.dto.request.DiscountTierRequest;
import com.ecom.product.dto.request.UpdateSaleCampaignRequest;
import com.ecom.product.dto.response.SaleCampaignResponse;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface SaleCampaignService {

    SaleCampaignDTO createSaleCampaign(CreateSaleCampaignRequest request);

    SaleCampaignDTO updateSaleCampaign(Long id, UpdateSaleCampaignRequest request);

    void deleteSaleCampaign(Long id);

    SaleCampaignDTO getSaleCampaignById(Long id);

    SaleCampaignResponse getAllSaleCampaigns(int page, int size, String status, String sortBy, String sortOrder);

    SaleCampaignDTO updateCategories(Long id, List<Long> categoryIds);

    SaleCampaignDTO updateDiscountTiers(Long id, List<DiscountTierRequest> tiers);

    List<SaleCampaignItemDTO> previewItems(Long id);

    SaleCampaignDTO activateSaleCampaign(Long id);

    SaleCampaignDTO cancelSaleCampaign(Long id);

    void updateSaleCampaignStatuses();

    List<SaleCampaignDTO> getActiveSaleCampaigns();

    SaleCampaignDTO getSaleCampaignBySlug(String slug);

    List<SaleCampaignItemDTO> getSaleCampaignItems(String slug, int limit);

    Optional<SaleCampaignItemDTO> getActiveSalePrice(Long variantId);

    boolean decrementSaleStock(Long variantId, int quantity);

    SaleCampaignDTO uploadBanner(Long id, MultipartFile file);
}
