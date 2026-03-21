package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyOrdersDTO {
    private Integer month;
    private String monthName;
    private Long totalOrders;
    private Long completed;
    private Long processing;
    private Long cancelled;
    private Long refunded;
}
