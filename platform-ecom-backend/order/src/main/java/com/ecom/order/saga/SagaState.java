package com.ecom.order.saga;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * L08: one row per order saga. confirmedItems counts SALE stock-updated
 * events carrying this orderNumber; DONE when all expected lines confirm.
 * Assumes one event per order line (distinct variants) — see L08 doc.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_sagas")
public class SagaState {

    @Id
    private Long orderId;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SagaStatus status;

    @Column(nullable = false)
    private int expectedItems;

    @Column(nullable = false)
    private int confirmedItems;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
