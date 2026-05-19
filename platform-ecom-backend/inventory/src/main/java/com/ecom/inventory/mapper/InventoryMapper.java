package com.ecom.inventory.mapper;

import com.ecom.inventory.dto.InventoryDTO;
import com.ecom.inventory.dto.InventoryTransactionDTO;
import com.ecom.inventory.dto.StockReservationDTO;
import com.ecom.inventory.entity.Inventory;
import com.ecom.inventory.entity.InventoryTransaction;
import com.ecom.inventory.entity.StockReservation;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryDTO toDTO(Inventory entity) {
        if (entity == null) return null;

        return InventoryDTO.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .variantId(entity.getVariantId())
                .sku(entity.getSku())
                .availableStock(entity.getAvailableStock())
                .reservedStock(entity.getReservedStock())
                .totalStock(entity.getTotalStock())
                .lowStockThreshold(entity.getLowStockThreshold())
                .reorderPoint(entity.getReorderPoint())
                .reorderQuantity(entity.getReorderQuantity())
                .trackInventory(entity.getTrackInventory())
                .isLowStock(entity.isLowStock())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public InventoryTransactionDTO toDTO(InventoryTransaction entity) {
        if (entity == null) return null;

        return InventoryTransactionDTO.builder()
                .id(entity.getId())
                .inventoryId(entity.getInventory().getId())
                .variantId(entity.getInventory().getVariantId())
                .type(entity.getType())
                .quantityChange(entity.getQuantityChange())
                .stockBefore(entity.getStockBefore())
                .stockAfter(entity.getStockAfter())
                .referenceType(entity.getReferenceType())
                .referenceId(entity.getReferenceId())
                .reason(entity.getReason())
                .performedBy(entity.getPerformedBy())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public StockReservationDTO toDTO(StockReservation entity) {
        if (entity == null) return null;

        return StockReservationDTO.builder()
                .id(entity.getId())
                .inventoryId(entity.getInventory().getId())
                .variantId(entity.getInventory().getVariantId())
                .cartId(entity.getCartId())
                .userId(entity.getUserId())
                .quantity(entity.getQuantity())
                .status(entity.getStatus())
                .reservedAt(entity.getReservedAt())
                .expiresAt(entity.getExpiresAt())
                .confirmedAt(entity.getConfirmedAt())
                .build();
    }
}
