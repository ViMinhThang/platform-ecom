package com.ecom.inventory.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class InventoryTest {

    @Test
    void recalculateAvailableStockUsesSellableStockWhenTrackingEnabled() {
        Inventory inventory = Inventory.builder()
                .totalStock(10)
                .reservedStock(3)
                .trackInventory(true)
                .build();

        inventory.recalculateAvailableStock();

        assertThat(inventory.getAvailableStock()).isEqualTo(7);
        assertThat(inventory.hasAvailableStock(7)).isTrue();
        assertThat(inventory.hasAvailableStock(8)).isFalse();
    }

    @Test
    void hasAvailableStockIgnoresLimitsWhenTrackingDisabled() {
        Inventory inventory = Inventory.builder()
                .totalStock(0)
                .reservedStock(0)
                .trackInventory(false)
                .build();

        inventory.recalculateAvailableStock();

        assertThat(inventory.getAvailableStock()).isZero();
        assertThat(inventory.hasAvailableStock(999)).isTrue();
        assertThat(inventory.isLowStock()).isFalse();
    }

    @Test
    void recalculateAvailableStockRejectsReservedStockAboveTotalStock() {
        Inventory inventory = Inventory.builder()
                .totalStock(2)
                .reservedStock(3)
                .trackInventory(true)
                .build();

        assertThatThrownBy(inventory::recalculateAvailableStock)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Reserved stock cannot exceed total stock");
    }
}
