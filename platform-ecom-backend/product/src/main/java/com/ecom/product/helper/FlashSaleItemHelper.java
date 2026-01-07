package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.dto.request.AddFlashSaleItemRequest;
import com.ecom.product.entity.FlashSale;
import com.ecom.product.entity.FlashSaleItem;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.repository.FlashSaleItemRepository;
import com.ecom.product.repository.FlashSaleRepository;
import com.ecom.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class FlashSaleItemHelper {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;
    private final ProductVariantRepository productVariantRepository;

    public void addItemsToFlashSale(FlashSale flashSale, List<AddFlashSaleItemRequest> itemRequests) {
        for (AddFlashSaleItemRequest itemReq : itemRequests) {
            FlashSaleItem item = createValidatedItem(flashSale, itemReq);
            flashSale.addItem(item);
        }
    }

    public Optional<FlashSaleItem> getActiveFlashSaleForVariant(Long variantId) {
        return flashSaleItemRepository.findActiveFlashSaleForVariant(variantId);
    }

    public boolean decrementStock(Long variantId, int quantity) {
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

    public FlashSaleItem findItemById(Long itemId) {
        return flashSaleItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale item not found"));
    }

    private FlashSaleItem createValidatedItem(FlashSale flashSale, AddFlashSaleItemRequest request) {
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + request.getVariantId()));

        validateNoOverlap(flashSale, variant);
        validateStockLimit(request, variant);

        return FlashSaleItem.builder()
                .flashSale(flashSale)
                .variant(variant)
                .flashSalePrice(request.getFlashSalePrice())
                .stockLimit(request.getStockLimit())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
    }

    private void validateNoOverlap(FlashSale flashSale, ProductVariant variant) {
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
    }

    private void validateStockLimit(AddFlashSaleItemRequest request, ProductVariant variant) {
        if (request.getStockLimit() > variant.getStock()) {
            throw new IllegalArgumentException(
                    "Stock limit exceeds available stock for variant: " + variant.getSku());
        }
    }
}
