package com.ecom.inventory.dto;

import com.ecom.inventory.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for inventory transaction history.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionDTO {
    private Long id;
    private Long inventoryId;
    private Long variantId;
    private TransactionType type;
    private Integer quantityChange;
    private Integer stockBefore;
    private Integer stockAfter;
    private String referenceType;
    private String referenceId;
    private String reason;
    private Long performedBy;
    private LocalDateTime createdAt;
}
