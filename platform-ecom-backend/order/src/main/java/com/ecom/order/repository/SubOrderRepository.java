package com.ecom.order.repository;

import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubOrderRepository extends JpaRepository<SubOrder, Long> {

    Optional<SubOrder> findBySubOrderNumber(String subOrderNumber);

    List<SubOrder> findByOrderGroupId(Long groupId);

    Page<SubOrder> findBySellerId(Long sellerId, Pageable pageable);

    List<SubOrder> findBySellerIdAndStatus(Long sellerId, SubOrderStatus status);

    @Query("SELECT so FROM SubOrder so " +
            "LEFT JOIN FETCH so.items " +
            "WHERE so.id = :subOrderId")
    Optional<SubOrder> findByIdWithItems(@Param("subOrderId") Long subOrderId);

    @Query("SELECT so FROM SubOrder so " +
            "WHERE so.orderGroup.id = :groupId " +
            "AND so.sellerId = :sellerId")
    Optional<SubOrder> findByGroupIdAndSellerId(
            @Param("groupId") Long groupId,
            @Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(so) FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "AND so.status IN ('PROCESSING', 'SHIPPED')")
    long countActiveOrdersBySeller(@Param("sellerId") Long sellerId);

    // Analytics queries for Seller Dashboard
    @Query("SELECT COALESCE(SUM(so.total), 0) FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "AND so.status = 'DELIVERED' " +
            "AND so.createdAt BETWEEN :startDate AND :endDate")
    java.math.BigDecimal getTotalRevenueByDateRange(
            @Param("sellerId") Long sellerId,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate);

    @Query("SELECT COUNT(so) FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "AND so.createdAt BETWEEN :startDate AND :endDate")
    Long countOrdersByDateRange(
            @Param("sellerId") Long sellerId,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate);

    @Query("SELECT COUNT(DISTINCT so.orderGroup.userId) FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "AND so.createdAt BETWEEN :startDate AND :endDate")
    Long countNewCustomersByDateRange(
            @Param("sellerId") Long sellerId,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate);

    @Query("SELECT COUNT(DISTINCT so.orderGroup.userId) FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "AND so.status IN ('PROCESSING', 'SHIPPED', 'TRANSPORTING', 'DELIVERING', 'DELIVERED') " +
            "AND so.updatedAt >= :since")
    Long countActiveAccounts(
            @Param("sellerId") Long sellerId,
            @Param("since") java.time.LocalDateTime since);

    @Query("SELECT COUNT(so) FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "AND so.status = :status " +
            "AND so.createdAt BETWEEN :startDate AND :endDate")
    Long countOrdersByStatusAndDateRange(
            @Param("sellerId") Long sellerId,
            @Param("status") SubOrderStatus status,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate);

    // Monthly aggregation for revenue
    @Query("SELECT MONTH(so.createdAt) as month, " +
            "       SUM(so.total) as revenue, " +
            "       COUNT(so) as orderCount " +
            "FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "  AND YEAR(so.createdAt) = :year " +
            "  AND so.status = 'DELIVERED' " +
            "GROUP BY MONTH(so.createdAt) " +
            "ORDER BY MONTH(so.createdAt)")
    List<Object[]> getMonthlyRevenue(
            @Param("sellerId") Long sellerId,
            @Param("year") int year);

    // Monthly aggregation for orders by status
    @Query("SELECT MONTH(so.createdAt) as month, " +
            "       so.status as status, " +
            "       COUNT(so) as count " +
            "FROM SubOrder so " +
            "WHERE so.sellerId = :sellerId " +
            "  AND YEAR(so.createdAt) = :year " +
            "GROUP BY MONTH(so.createdAt), so.status " +
            "ORDER BY MONTH(so.createdAt)")
    List<Object[]> getMonthlyOrdersByStatus(
            @Param("sellerId") Long sellerId,
            @Param("year") int year);
}
