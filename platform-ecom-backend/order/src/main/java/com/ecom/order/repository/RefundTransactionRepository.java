package com.ecom.order.repository;

import com.ecom.order.entity.RefundTransaction;
import com.ecom.order.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundTransactionRepository extends JpaRepository<RefundTransaction, Long> {

    List<RefundTransaction> findBySubOrderId(Long subOrderId);

    Optional<RefundTransaction> findByProviderRefundId(String providerRefundId);

    @Query("SELECT rt FROM RefundTransaction rt " +
            "WHERE rt.subOrder.orderGroup.id = :groupId")
    List<RefundTransaction> findByOrderGroupId(@Param("groupId") Long groupId);

    @Query("SELECT rt FROM RefundTransaction rt " +
            "WHERE rt.originalTransaction.id = :transactionId")
    List<RefundTransaction> findByOriginalTransactionId(@Param("transactionId") Long transactionId);

    List<RefundTransaction> findByProviderAndStatus(String provider, PaymentStatus status);
}
