package com.ecom.order.repository;

import com.ecom.order.entity.PaymentWebhook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentWebhookRepository extends JpaRepository<PaymentWebhook, Long> {

    Optional<PaymentWebhook> findByEventId(String eventId);

    boolean existsByEventId(String eventId);

    List<PaymentWebhook> findByProviderAndStatus(String provider, String status);

    List<PaymentWebhook> findByStatusAndRetryCountLessThan(String status, Integer maxRetries);
}
