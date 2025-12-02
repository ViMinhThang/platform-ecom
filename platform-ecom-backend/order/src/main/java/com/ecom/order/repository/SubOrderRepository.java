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
}
