package com.ecom.order.service.impl;

import com.ecom.order.dto.*;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import com.ecom.order.repository.SubOrderRepository;
import com.ecom.order.service.signature.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final SubOrderRepository subOrderRepository;

    private static final String[] MONTH_NAMES = {
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    };

    @Override
    public DashboardOverviewDTO getDashboardOverview(Long sellerId, int year) {
        LocalDate currentYearStart = LocalDate.of(year, 1, 1);
        LocalDate currentYearEnd = LocalDate.of(year, 12, 31);
        LocalDate previousYearStart = LocalDate.of(year - 1, 1, 1);
        LocalDate previousYearEnd = LocalDate.of(year - 1, 12, 31);

        LocalDateTime currentYearStartDt = currentYearStart.atStartOfDay();
        LocalDateTime currentYearEndDt = currentYearEnd.atTime(LocalTime.MAX);
        LocalDateTime previousYearStartDt = previousYearStart.atStartOfDay();
        LocalDateTime previousYearEndDt = previousYearEnd.atTime(LocalTime.MAX);

        // Current year stats
        BigDecimal currentRevenue = subOrderRepository.getTotalRevenueByDateRange(sellerId, currentYearStartDt, currentYearEndDt);
        Long currentOrders = subOrderRepository.countOrdersByDateRange(sellerId, currentYearStartDt, currentYearEndDt);
        Long currentNewCustomers = subOrderRepository.countNewCustomersByDateRange(sellerId, currentYearStartDt, currentYearEndDt);

        // Previous year stats for growth calculation
        BigDecimal previousRevenue = subOrderRepository.getTotalRevenueByDateRange(sellerId, previousYearStartDt, previousYearEndDt);
        Long previousOrders = subOrderRepository.countOrdersByDateRange(sellerId, previousYearStartDt, previousYearEndDt);
        Long previousNewCustomers = subOrderRepository.countNewCustomersByDateRange(sellerId, previousYearStartDt, previousYearEndDt);

        // Calculate growth percentages
        Double revenueGrowth = calculateGrowth(currentRevenue, previousRevenue);
        Double orderGrowth = calculateGrowth(BigDecimal.valueOf(currentOrders), BigDecimal.valueOf(previousOrders));
        Double customerGrowth = calculateGrowth(BigDecimal.valueOf(currentNewCustomers), BigDecimal.valueOf(previousNewCustomers));

        // Active accounts (users with activity in last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Long activeAccounts = subOrderRepository.countActiveAccounts(sellerId, thirtyDaysAgo);

        // Order status counts
        Long completedOrders = subOrderRepository.countOrdersByStatusAndDateRange(
                sellerId, SubOrderStatus.DELIVERED, currentYearStartDt, currentYearEndDt);
        Long processingOrders = subOrderRepository.countOrdersByStatusAndDateRange(
                sellerId, SubOrderStatus.PROCESSING, currentYearStartDt, currentYearEndDt);
        Long cancelledOrders = subOrderRepository.countOrdersByStatusAndDateRange(
                sellerId, SubOrderStatus.CANCELLED, currentYearStartDt, currentYearEndDt);

        return DashboardOverviewDTO.builder()
                .totalRevenue(currentRevenue != null ? currentRevenue : BigDecimal.ZERO)
                .revenueGrowth(revenueGrowth)
                .totalOrders(currentOrders != null ? currentOrders : 0L)
                .orderGrowth(orderGrowth)
                .newCustomers(currentNewCustomers != null ? currentNewCustomers : 0L)
                .customerGrowth(customerGrowth)
                .activeAccounts(activeAccounts != null ? activeAccounts : 0L)
                .completedOrders(completedOrders != null ? completedOrders : 0L)
                .processingOrders(processingOrders != null ? processingOrders : 0L)
                .cancelledOrders(cancelledOrders != null ? cancelledOrders : 0L)
                .build();
    }

    @Override
    public List<MonthlyRevenueDTO> getRevenueByMonth(Long sellerId, int year) {
        List<Object[]> results = subOrderRepository.getMonthlyRevenue(sellerId, year);

        // Create a map for quick lookup
        Map<Integer, MonthlyRevenueDTO> revenueMap = results.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> MonthlyRevenueDTO.builder()
                                .month(((Number) row[0]).intValue())
                                .monthName(MONTH_NAMES[((Number) row[0]).intValue() - 1])
                                .revenue(new BigDecimal(row[1].toString()))
                                .orderCount(((Number) row[2]).longValue())
                                .build()
                ));

        // Fill in all 12 months
        List<MonthlyRevenueDTO> monthlyData = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            monthlyData.add(revenueMap.getOrDefault(month,
                    MonthlyRevenueDTO.builder()
                            .month(month)
                            .monthName(MONTH_NAMES[month - 1])
                            .revenue(BigDecimal.ZERO)
                            .orderCount(0L)
                            .build()
            ));
        }

        return monthlyData;
    }

    @Override
    public List<MonthlyOrdersDTO> getOrdersByMonth(Long sellerId, int year) {
        List<Object[]> results = subOrderRepository.getMonthlyOrdersByStatus(sellerId, year);

        // Group by month
        Map<Integer, Map<String, Long>> monthlyStatusMap = new HashMap<>();
        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            String status = (String) row[1];
            long count = ((Number) row[2]).longValue();

            monthlyStatusMap.computeIfAbsent(month, k -> new HashMap<>())
                    .put(status, count);
        }

        // Build DTO for each month
        List<MonthlyOrdersDTO> monthlyData = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Map<String, Long> statusCounts = monthlyStatusMap.getOrDefault(month, Collections.emptyMap());

            long total = statusCounts.values().stream().mapToLong(Long::longValue).sum();

            monthlyData.add(MonthlyOrdersDTO.builder()
                    .month(month)
                    .monthName(MONTH_NAMES[month - 1])
                    .totalOrders(total)
                    .completed(statusCounts.getOrDefault("DELIVERED", 0L))
                    .processing(statusCounts.getOrDefault("PROCESSING", 0L) +
                            statusCounts.getOrDefault("SHIPPED", 0L) +
                            statusCounts.getOrDefault("TRANSPORTING", 0L))
                    .cancelled(statusCounts.getOrDefault("CANCELLED", 0L))
                    .refunded(statusCounts.getOrDefault("FULLY_REFUNDED", 0L) +
                            statusCounts.getOrDefault("PARTIALLY_REFUNDED", 0L))
                    .build());
        }

        return monthlyData;
    }

    @Override
    public List<RecentOrderDTO> getRecentOrders(Long sellerId, int limit) {
        List<SubOrder> orders = subOrderRepository.findBySellerId(sellerId, PageRequest.of(0, limit, Sort.by("createdAt").descending())).getContent();

        return orders.stream()
                .map(this::mapToRecentOrderDTO)
                .collect(Collectors.toList());
    }

    private RecentOrderDTO mapToRecentOrderDTO(SubOrder order) {
        return RecentOrderDTO.builder()
                .id(order.getId())
                .groupNumber(order.getSubOrderNumber())
                .customerName("Customer")
                .customerEmail("")
                .totalAmount(order.getTotal())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private Double calculateGrowth(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }

        BigDecimal growth = current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        return growth.setScale(1, RoundingMode.HALF_UP).doubleValue();
    }
}
