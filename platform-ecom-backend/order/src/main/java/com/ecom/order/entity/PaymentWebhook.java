package com.ecom.order.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Payment Webhook Log for audit trail
 */
@Entity
@Table(name = "payment_webhooks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentWebhook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "webhook_id")
    private Long id;

    @Column(name = "provider", length = 50, nullable = false)
    private String provider;

    @Column(name = "event_id", unique = true, nullable = false)
    private String eventId;

    @Column(name = "event_type", length = 100, nullable = false)
    private String eventType;

    @Column(name = "payload", columnDefinition = "TEXT", nullable = false)
    private String payload;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "retry_count")
    @Builder.Default
    private Integer retryCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
