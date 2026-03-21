package com.ecom.order.service.signature;

import com.ecom.order.dto.*;

import java.util.List;

public interface AdminAnalyticsService {

    DashboardOverviewDTO getDashboardOverview(Long sellerId, int year);

    List<MonthlyRevenueDTO> getRevenueByMonth(Long sellerId, int year);

    List<MonthlyOrdersDTO> getOrdersByMonth(Long sellerId, int year);

    List<RecentOrderDTO> getRecentOrders(Long sellerId, int limit);
}
