package com.ecom.inventory.dto;

import com.ecom.inventory.entity.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for stock reservation responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockReservationDTO {
    private Long id;
    private Long inventoryId;
    private Long variantId;
    private Long cartId;
    private Long userId;
    private Integer quantity;
    private ReservationStatus status;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime confirmedAt;
}
