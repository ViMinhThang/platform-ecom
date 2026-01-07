package com.ecom.product.controller.Admin;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.FlashSaleDTO;
import com.ecom.product.dto.request.AddFlashSaleItemRequest;
import com.ecom.product.dto.request.CreateFlashSaleRequest;
import com.ecom.product.dto.request.UpdateFlashSaleItemRequest;
import com.ecom.product.dto.request.UpdateFlashSaleRequest;
import com.ecom.product.dto.response.FlashSaleResponse;
import com.ecom.product.service.signature.FlashSaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/flash-sales")
@RequiredArgsConstructor
public class AdminFlashSaleController {

    private final FlashSaleService flashSaleService;

    @PostMapping
    public ResponseEntity<APIResponse<FlashSaleDTO>> createFlashSale(
            @Valid @RequestBody CreateFlashSaleRequest request) {
        FlashSaleDTO flashSale = flashSaleService.createFlashSale(request);
        return ResponseBuilder.createdWithMessage("Flash sale created successfully", flashSale);
    }

    @GetMapping
    public ResponseEntity<APIResponse<FlashSaleResponse>> getAllFlashSales(
            PaginationRequest paginationRequest,
            @RequestParam(name = "status", required = false) String status) {
        FlashSaleResponse response = flashSaleService.getAllFlashSales(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                status,
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("Flash sales retrieved successfully", response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<FlashSaleDTO>> getFlashSaleById(@PathVariable Long id) {
        FlashSaleDTO flashSale = flashSaleService.getFlashSaleById(id);
        return ResponseBuilder.success("Flash sale retrieved successfully", flashSale);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<FlashSaleDTO>> updateFlashSale(
            @PathVariable Long id,
            @RequestBody UpdateFlashSaleRequest request) {
        FlashSaleDTO flashSale = flashSaleService.updateFlashSale(id, request);
        return ResponseBuilder.success("Flash sale updated successfully", flashSale);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteFlashSale(@PathVariable Long id) {
        flashSaleService.deleteFlashSale(id);
        return ResponseBuilder.success("Flash sale deleted successfully", null);
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<APIResponse<FlashSaleDTO>> addItems(
            @PathVariable Long id,
            @Valid @RequestBody List<AddFlashSaleItemRequest> items) {
        FlashSaleDTO flashSale = flashSaleService.addItems(id, items);
        return ResponseBuilder.success("Items added successfully", flashSale);
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<APIResponse<FlashSaleDTO>> removeItem(
            @PathVariable Long id,
            @PathVariable Long itemId) {
        FlashSaleDTO flashSale = flashSaleService.removeItem(id, itemId);
        return ResponseBuilder.success("Item removed successfully", flashSale);
    }

    @PutMapping("/{id}/items/{itemId}")
    public ResponseEntity<APIResponse<FlashSaleDTO>> updateItem(
            @PathVariable Long id,
            @PathVariable Long itemId,
            @RequestBody UpdateFlashSaleItemRequest request) {
        FlashSaleDTO flashSale = flashSaleService.updateItem(id, itemId, request);
        return ResponseBuilder.success("Item updated successfully", flashSale);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<APIResponse<FlashSaleDTO>> activateFlashSale(@PathVariable Long id) {
        FlashSaleDTO flashSale = flashSaleService.activateFlashSale(id);
        return ResponseBuilder.success("Flash sale activated successfully", flashSale);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<APIResponse<FlashSaleDTO>> cancelFlashSale(@PathVariable Long id) {
        FlashSaleDTO flashSale = flashSaleService.cancelFlashSale(id);
        return ResponseBuilder.success("Flash sale cancelled successfully", flashSale);
    }

    @PostMapping(value = "/{id}/banner", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<FlashSaleDTO>> uploadBanner(
            @PathVariable Long id,
            @RequestParam("banner") MultipartFile file) {
        FlashSaleDTO flashSale = flashSaleService.uploadBanner(id, file);
        return ResponseBuilder.success("Banner uploaded successfully", flashSale);
    }
}
