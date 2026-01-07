package com.ecom.product.controller.Admin;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.SaleCampaignDTO;
import com.ecom.product.dto.SaleCampaignItemDTO;
import com.ecom.product.dto.response.SaleCampaignResponse;
import com.ecom.product.dto.request.CreateSaleCampaignRequest;
import com.ecom.product.dto.request.DiscountTierRequest;
import com.ecom.product.dto.request.UpdateSaleCampaignRequest;
import com.ecom.product.service.signature.SaleCampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/sale-campaigns")
@RequiredArgsConstructor
public class AdminSaleCampaignController {

    private final SaleCampaignService saleCampaignService;

    @PostMapping
    public ResponseEntity<APIResponse<SaleCampaignDTO>> createSaleCampaign(
            @Valid @RequestBody CreateSaleCampaignRequest request) {
        SaleCampaignDTO saleCampaign = saleCampaignService.createSaleCampaign(request);
        return ResponseBuilder.createdWithMessage("Sale campaign created successfully", saleCampaign);
    }

    @GetMapping
    public ResponseEntity<APIResponse<SaleCampaignResponse>> getAllSaleCampaigns(
            PaginationRequest paginationRequest,
            @RequestParam(name = "status", required = false) String status) {
        SaleCampaignResponse response = saleCampaignService.getAllSaleCampaigns(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                status,
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("Sale campaigns retrieved successfully", response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<SaleCampaignDTO>> getSaleCampaignById(@PathVariable Long id) {
        SaleCampaignDTO saleCampaign = saleCampaignService.getSaleCampaignById(id);
        return ResponseBuilder.success("Sale campaign retrieved successfully", saleCampaign);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<SaleCampaignDTO>> updateSaleCampaign(
            @PathVariable Long id,
            @RequestBody UpdateSaleCampaignRequest request) {
        SaleCampaignDTO saleCampaign = saleCampaignService.updateSaleCampaign(id, request);
        return ResponseBuilder.success("Sale campaign updated successfully", saleCampaign);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteSaleCampaign(@PathVariable Long id) {
        saleCampaignService.deleteSaleCampaign(id);
        return ResponseBuilder.success("Sale campaign deleted successfully", null);
    }

    // ==================== Category Management ====================

    @PutMapping("/{id}/categories")
    public ResponseEntity<APIResponse<SaleCampaignDTO>> updateCategories(
            @PathVariable Long id,
            @RequestBody List<Long> categoryIds) {
        SaleCampaignDTO saleCampaign = saleCampaignService.updateCategories(id, categoryIds);
        return ResponseBuilder.success("Categories updated successfully", saleCampaign);
    }

    // ==================== Discount Tier Management ====================

    @PutMapping("/{id}/discount-tiers")
    public ResponseEntity<APIResponse<SaleCampaignDTO>> updateDiscountTiers(
            @PathVariable Long id,
            @Valid @RequestBody List<DiscountTierRequest> tiers) {
        SaleCampaignDTO saleCampaign = saleCampaignService.updateDiscountTiers(id, tiers);
        return ResponseBuilder.success("Discount tiers updated successfully", saleCampaign);
    }

    // ==================== Item Preview ====================

    @GetMapping("/{id}/preview-items")
    public ResponseEntity<APIResponse<List<SaleCampaignItemDTO>>> previewItems(@PathVariable Long id) {
        List<SaleCampaignItemDTO> items = saleCampaignService.previewItems(id);
        return ResponseBuilder.success("Preview items generated successfully", items);
    }

    // ==================== Status Management ====================

    @PostMapping("/{id}/activate")
    public ResponseEntity<APIResponse<SaleCampaignDTO>> activateSaleCampaign(@PathVariable Long id) {
        SaleCampaignDTO saleCampaign = saleCampaignService.activateSaleCampaign(id);
        return ResponseBuilder.success("Sale campaign activated successfully", saleCampaign);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<APIResponse<SaleCampaignDTO>> cancelSaleCampaign(@PathVariable Long id) {
        SaleCampaignDTO saleCampaign = saleCampaignService.cancelSaleCampaign(id);
        return ResponseBuilder.success("Sale campaign cancelled successfully", saleCampaign);
    }

    // ==================== Banner Upload ====================

    @PostMapping(value = "/{id}/banner", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<SaleCampaignDTO>> uploadBanner(
            @PathVariable Long id,
            @RequestParam("banner") MultipartFile file) {
        SaleCampaignDTO saleCampaign = saleCampaignService.uploadBanner(id, file);
        return ResponseBuilder.success("Banner uploaded successfully", saleCampaign);
    }
}
