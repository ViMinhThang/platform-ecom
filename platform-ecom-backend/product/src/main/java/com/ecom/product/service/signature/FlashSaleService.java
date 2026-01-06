package com.ecom.product.service.signature;

import com.ecom.product.dto.FlashSaleDTO;
import com.ecom.product.dto.FlashSaleItemDTO;
import com.ecom.product.dto.FlashSaleResponse;
import com.ecom.product.dto.request.AddFlashSaleItemRequest;
import com.ecom.product.dto.request.CreateFlashSaleRequest;
import com.ecom.product.dto.request.UpdateFlashSaleItemRequest;
import com.ecom.product.dto.request.UpdateFlashSaleRequest;

import java.util.List;
import java.util.Optional;


public interface FlashSaleService {


    FlashSaleDTO createFlashSale(CreateFlashSaleRequest request);

    FlashSaleDTO updateFlashSale(Long id, UpdateFlashSaleRequest request);


    void deleteFlashSale(Long id);


    FlashSaleDTO getFlashSaleById(Long id);


    FlashSaleResponse getAllFlashSales(int page, int size, String status, String sortBy, String sortOrder);


    FlashSaleDTO addItems(Long flashSaleId, List<AddFlashSaleItemRequest> items);
    FlashSaleDTO removeItem(Long flashSaleId, Long itemId);
    FlashSaleDTO updateItem(Long flashSaleId, Long itemId, UpdateFlashSaleItemRequest request);

    List<FlashSaleDTO> getActiveFlashSales();


    List<FlashSaleDTO> getActiveFlashSales();


    FlashSaleDTO getFlashSaleBySlug(String slug);


    List<FlashSaleItemDTO> getFlashSaleItems(String slug, int limit);


    Optional<FlashSaleItemDTO> getActiveFlashSalePrice(Long variantId);


    FlashSaleDTO activateFlashSale(Long id);

    FlashSaleDTO cancelFlashSale(Long id);


    void updateFlashSaleStatuses();


    boolean decrementFlashSaleStock(Long variantId, int quantity);
}
