package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentOrderDTO {
    private Long id;
    private String groupNumber;
    private String customerName;
    private String customerEmail;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
}
