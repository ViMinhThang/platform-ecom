package com.ecom.inventory.helper;

import com.ecom.common.event.LowStockAlertEvent;
import com.ecom.common.event.OutOfStockEvent;
import com.ecom.common.event.StockUpdatedEvent;
import com.ecom.inventory.entity.Inventory;
import com.ecom.inventory.entity.InventoryTransaction;
import com.ecom.inventory.entity.TransactionType;
import com.ecom.inventory.event.InventoryEventPublisher;
import com.ecom.inventory.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryTransactionHelper {

    private final InventoryTransactionRepository transactionRepository;
    private final InventoryEventPublisher eventPublisher;

    public void recordTransaction(Inventory inventory, TransactionType type, int quantityChange,
            int stockBefore, int stockAfter, String referenceType,
            String referenceId, String reason, Long performedBy) {
        InventoryTransaction transaction = InventoryTransaction.builder()
                .inventory(inventory)
                .type(type)
                .quantityChange(quantityChange)
                .stockBefore(stockBefore)
                .stockAfter(stockAfter)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .reason(reason)
                .performedBy(performedBy)
                .build();

        transactionRepository.save(transaction);
    }

    public void publishStockUpdatedEvent(Inventory inventory, int previousStock,
            TransactionType type, String reason, Long performedBy) {
        publishStockUpdatedEvent(inventory, previousStock, type, reason, performedBy, null);
    }

    /**
     * L08: orderNumber overload — only the order-driven path supplies it.
     * Ambient moves keep null so the orchestrator can tell them apart.
     */
    public void publishStockUpdatedEvent(Inventory inventory, int previousStock,
            TransactionType type, String reason, Long performedBy, String orderNumber) {
        StockUpdatedEvent event = StockUpdatedEvent.builder()
                .variantId(inventory.getVariantId())
                .productId(inventory.getProductId())
                .previousStock(previousStock)
                .newStock(inventory.getTotalStock())
                .availableStock(inventory.getAvailableStock())
                .reservedStock(inventory.getReservedStock())
                .transactionType(type.name())
                .reason(reason)
                .performedBy(performedBy)
                .orderNumber(orderNumber)
                .timestamp(LocalDateTime.now())
                .build();

        eventPublisher.publishStockUpdated(event);
    }

    public void checkAndAlert(Inventory inventory) {
        if (!Boolean.TRUE.equals(inventory.getTrackInventory())) {
            return;
        }
        checkAndAlertLowStock(inventory);
        checkAndAlertOutOfStock(inventory);
    }

    private void checkAndAlertLowStock(Inventory inventory) {
        if (inventory.isLowStock()) {
            LowStockAlertEvent alert = LowStockAlertEvent.builder()
                    .variantId(inventory.getVariantId())
                    .productId(inventory.getProductId())
                    .sku(inventory.getSku())
                    .currentStock(inventory.getAvailableStock())
                    .threshold(inventory.getLowStockThreshold())
                    .timestamp(LocalDateTime.now())
                    .build();

            eventPublisher.publishLowStockAlert(alert);
            log.warn("Low stock alert for variant {}: {} <= {}",
                    inventory.getVariantId(), inventory.getAvailableStock(), inventory.getLowStockThreshold());
        }
    }

    private void checkAndAlertOutOfStock(Inventory inventory) {
        if (inventory.getAvailableStock() == 0) {
            OutOfStockEvent event = OutOfStockEvent.builder()
                    .productId(inventory.getProductId())
                    .variantId(inventory.getVariantId())
                    .sku(inventory.getSku())
                    .timestamp(LocalDateTime.now())
                    .build();

            eventPublisher.publishOutOfStock(event);
            log.warn("Out of stock alert for variant {}: availableStock=0", inventory.getVariantId());
        }
    }

    /**
     * L08: explicit failure signal for the saga orchestrator — carries the
     * failing orderNumber, unlike the ambient alert above which stays
     * order-free (broadcast for cart cleanup).
     */
    public void publishOrderFailedEvent(Inventory inventory, String orderNumber) {
        OutOfStockEvent event = OutOfStockEvent.builder()
                .productId(inventory.getProductId())
                .variantId(inventory.getVariantId())
                .sku(inventory.getSku())
                .orderNumber(orderNumber)
                .timestamp(LocalDateTime.now())
                .build();

        eventPublisher.publishOutOfStock(event);
    }
}
