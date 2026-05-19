package com.ecom.inventory.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.inventory.entity.Inventory;
import com.ecom.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryHelper {

    private final InventoryRepository inventoryRepository;

    public Inventory findByVariantIdOrThrow(Long variantId) {
        return inventoryRepository.findByVariantId(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "variantId", variantId));
    }

    public Inventory findByVariantIdForUpdateOrThrow(Long variantId) {
        return inventoryRepository.findByVariantIdForUpdate(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "variantId", variantId));
    }

    public boolean existsByVariantId(Long variantId) {
        return inventoryRepository.existsByVariantId(variantId);
    }
}
