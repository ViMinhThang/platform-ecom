package com.ecom.order.repository;

import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.OrderGroupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderGroupRepository extends JpaRepository<OrderGroup, Long> {

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
}
