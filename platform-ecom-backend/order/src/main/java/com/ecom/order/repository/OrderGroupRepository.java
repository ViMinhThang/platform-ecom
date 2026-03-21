package com.ecom.order.repository;

import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.OrderGroupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderGroupRepository extends JpaRepository<OrderGroup, Long>, JpaSpecificationExecutor<OrderGroup> {

        Optional<OrderGroup> findByGroupNumber(String groupNumber);

        Page<OrderGroup> findByUserId(Long userId, Pageable pageable);

        List<OrderGroup> findByUserIdAndOverallStatus(Long userId, OrderGroupStatus status);

        @Query("SELECT og FROM OrderGroup og " +
                        "LEFT JOIN FETCH og.subOrders " +
                        "WHERE og.id = :groupId")
        Optional<OrderGroup> findByIdWithSubOrders(@Param("groupId") Long groupId);

        @Query("SELECT og FROM OrderGroup og " +
                        "WHERE og.userId = :userId " +
                        "AND og.createdAt BETWEEN :startDate AND :endDate")
        List<OrderGroup> findByUserIdAndDateRange(
                        @Param("userId") Long userId,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(og) FROM OrderGroup og " +
                        "WHERE og.userId = :userId " +
                        "AND og.paymentStatus = 'SUCCEEDED'")
        long countCompletedOrdersByUser(@Param("userId") Long userId);

        // Analytics queries
        @Query("SELECT COALESCE(SUM(og.totalAmount), 0) FROM OrderGroup og " +
                        "WHERE og.overallStatus = 'COMPLETED' " +
                        "AND og.createdAt BETWEEN :startDate AND :endDate")
        BigDecimal getTotalRevenueByDateRange(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(og) FROM OrderGroup og " +
                        "WHERE og.createdAt BETWEEN :startDate AND :endDate")
        Long countOrdersByDateRange(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(DISTINCT og.userId) FROM OrderGroup og " +
                        "WHERE og.createdAt BETWEEN :startDate AND :endDate")
        Long countNewCustomersByDateRange(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(DISTINCT og.userId) FROM OrderGroup og " +
                        "WHERE og.overallStatus IN ('PROCESSING', 'PARTIALLY_SHIPPED', 'COMPLETED') " +
                        "AND og.updatedAt >= :since")
        Long countActiveAccounts(@Param("since") LocalDateTime since);

        @Query("SELECT COUNT(og) FROM OrderGroup og " +
                        "WHERE og.overallStatus = :status " +
                        "AND og.createdAt BETWEEN :startDate AND :endDate")
        Long countOrdersByStatusAndDateRange(
                        @Param("status") OrderGroupStatus status,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        // Monthly aggregation for revenue
        @Query("SELECT MONTH(og.createdAt) as month, " +
                        "       SUM(og.totalAmount) as revenue, " +
                        "       COUNT(og) as orderCount " +
                        "FROM OrderGroup og " +
                        "WHERE YEAR(og.createdAt) = :year " +
                        "  AND og.overallStatus = 'COMPLETED' " +
                        "GROUP BY MONTH(og.createdAt) " +
                        "ORDER BY MONTH(og.createdAt)")
        List<Object[]> getMonthlyRevenue(@Param("year") int year);

        // Monthly aggregation for orders by status
        @Query("SELECT MONTH(og.createdAt) as month, " +
                        "       og.overallStatus as status, " +
                        "       COUNT(og) as count " +
                        "FROM OrderGroup og " +
                        "WHERE YEAR(og.createdAt) = :year " +
                        "GROUP BY MONTH(og.createdAt), og.overallStatus " +
                        "ORDER BY MONTH(og.createdAt)")
        List<Object[]> getMonthlyOrdersByStatus(@Param("year") int year);

        // Recent orders
        @Query("SELECT og FROM OrderGroup og " +
                        "ORDER BY og.createdAt DESC")
        List<OrderGroup> findRecentOrders(Pageable pageable);
}
