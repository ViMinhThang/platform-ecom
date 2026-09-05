package com.ecom.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * L07: transactional outbox. Written in the SAME transaction as the order
 * (see OrderGroupServiceImpl.confirmPaymentAndCreateOrder), relayed to Kafka
 * afterwards by OutboxRelay. Crash between order-save and Kafka-send can no
 * longer lose the event — worst case it is relayed twice, and the consumer
 * is idempotent.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "outbox_events")
public class OutboxEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String recordKey;

    /** Serialized OrderCreatedEvent JSON. */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean published;

    private LocalDateTime publishedAt;
}
