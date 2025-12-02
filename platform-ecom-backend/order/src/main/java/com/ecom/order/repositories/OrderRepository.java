package com.ecom.order.repositories;

import com.ecom.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
                SELECT DISTINCT o\s
                FROM Order o\s
                JOIN o.orderItems oi\s
                WHERE oi.productId IN :productIds
            """)
    Page<Order> findOrdersByProductIds(@Param("productIds") List<Long> productIds, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalRevenue();

    // Find all orders for a specific user (by email) ordered by date descending
    Page<Order> findByEmailOrderByOrderDateDesc(String email, Pageable pageable);

    List<Order> findByEmailAndOrderStatus(String email, String orderStatus);
}
