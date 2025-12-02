package com.ecom.order.repository;

import com.ecom.order.entity.PaymentTransaction;
import com.ecom.order.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByIdempotencyKey(String idempotencyKey);

    boolean existsByIdempotencyKey(String idempotencyKey);

    Optional<PaymentTransaction> findByProviderTransactionId(String providerTransactionId);

    @Query("SELECT pt FROM PaymentTransaction pt " +
            "WHERE pt.orderGroup.id = :groupId " +
            "ORDER BY pt.createdAt DESC")
    List<PaymentTransaction> findByGroupId(@Param("groupId") Long groupId);

    @Query("SELECT pt FROM PaymentTransaction pt " +
            "WHERE pt.orderGroup.id = :groupId " +
            "AND pt.status = :status")
    Optional<PaymentTransaction> findByGroupIdAndStatus(
            @Param("groupId") Long groupId,
            @Param("status") PaymentStatus status);

    List<PaymentTransaction> findByProviderAndStatus(String provider, PaymentStatus status);
}
