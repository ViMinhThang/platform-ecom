package com.ecom.inventory.service.impl;

import com.ecom.common.exception.InsufficientStockException;
import com.ecom.inventory.entity.Inventory;
import com.ecom.inventory.helper.InventoryHelper;
import com.ecom.inventory.helper.InventoryTransactionHelper;
import com.ecom.inventory.mapper.InventoryMapper;
import com.ecom.inventory.repository.InventoryRepository;
import com.ecom.inventory.repository.InventoryTransactionRepository;
import com.ecom.inventory.repository.StockReservationRepository;
import com.ecom.inventory.service.signature.StockReservationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryServiceImplTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private InventoryTransactionRepository transactionRepository;

    @Mock
    private StockReservationRepository reservationRepository;

    @Mock
    private InventoryMapper mapper;

    @Mock
    private InventoryHelper inventoryHelper;

    @Mock
    private InventoryTransactionHelper transactionHelper;

    @Mock
    private StockReservationService reservationService;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    @Test
    void processOrderCreatedSkipsReplayForExistingOrderReference() {
        Inventory inventory = Inventory.builder()
                .id(15L)
                .productId(30L)
                .variantId(45L)
                .totalStock(5)
                .reservedStock(0)
                .trackInventory(true)
                .build();

        when(inventoryHelper.findByVariantIdForUpdateOrThrow(45L)).thenReturn(inventory);
        when(transactionRepository.existsByInventoryIdAndReferenceTypeAndReferenceId(15L, "ORDER", "ORD-1"))
                .thenReturn(true);

        inventoryService.processOrderCreated(45L, 1, "ORD-1");

        verify(inventoryRepository, never()).save(any());
        verify(transactionHelper, never()).recordTransaction(any(), any(), org.mockito.ArgumentMatchers.anyInt(),
                org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), anyString(),
                anyString(), anyString(), any());
    }

    @Test
    void processOrderCreatedRejectsOversellInsteadOfClampingStock() {
        Inventory inventory = Inventory.builder()
                .id(16L)
                .productId(31L)
                .variantId(46L)
                .totalStock(1)
                .reservedStock(0)
                .trackInventory(true)
                .build();

        when(inventoryHelper.findByVariantIdForUpdateOrThrow(46L)).thenReturn(inventory);
        when(transactionRepository.existsByInventoryIdAndReferenceTypeAndReferenceId(16L, "ORDER", "ORD-2"))
                .thenReturn(false);

        assertThatThrownBy(() -> inventoryService.processOrderCreated(46L, 2, "ORD-2"))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("ORD-2");

        verify(inventoryRepository, never()).save(any());
    }
}
