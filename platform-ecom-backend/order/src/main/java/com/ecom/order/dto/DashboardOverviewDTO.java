package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDTO {
    private BigDecimal totalRevenue;
    private Double revenueGrowth;
    private Long totalOrders;
    private Double orderGrowth;
    private Long newCustomers;
    private Double customerGrowth;
    private Long activeAccounts;
    private Long completedOrders;
    private Long processingOrders;
    private Long cancelledOrders;
}
