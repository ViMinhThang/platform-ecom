package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubOrderStatusHistoryDTO {
    private Long id;
    private String oldStatus;
    private String newStatus;
    private Long changedBy;
    private String notes;
    private LocalDateTime changedAt;
}
