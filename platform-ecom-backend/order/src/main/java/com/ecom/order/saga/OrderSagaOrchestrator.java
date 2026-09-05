package com.ecom.order.saga;

import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.OutOfStockEvent;
import com.ecom.common.event.StockUpdatedEvent;
import com.ecom.order.entity.OrderGroupStatus;
import com.ecom.order.repository.OrderGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * L08: the orchestrator. Watches the same topics as the choreography but
 * keeps explicit per-order state and performs the compensation (cancel).
 * Runs in GROUP_ORDER_SAGA — independent offsets from the cart-cleanup
 * consumer on the same out-of-stock topic.
 *
 * Correlates ONLY on orderNumber: null-carrying events are ambient moves
 * (adjustments, post-sale depletion alerts) and are acked untouched.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderSagaOrchestrator {

    private final SagaStateRepository sagaRepository;
    private final OrderGroupRepository orderGroupRepository;

    @KafkaListener(topics = KafkaTopics.STOCK_UPDATED, groupId = KafkaTopics.GROUP_ORDER_SAGA)
    @Transactional
    public void onStockUpdated(StockUpdatedEvent event, Acknowledgment ack) {
        if (event.getOrderNumber() == null || !"SALE".equals(event.getTransactionType())) {
            ack.acknowledge();
            return;
        }
        try {
            SagaState saga = sagaRepository.findByOrderNumber(event.getOrderNumber()).orElse(null);
            if (saga == null || saga.getStatus() == SagaStatus.DONE || saga.getStatus() == SagaStatus.FAILED) {
                ack.acknowledge();
                return;
            }
            saga.setConfirmedItems(saga.getConfirmedItems() + 1);
            if (saga.getConfirmedItems() >= saga.getExpectedItems()) {
                saga.setStatus(SagaStatus.DONE);
                log.info("Saga DONE for order {}", event.getOrderNumber());
            } else {
                saga.setStatus(SagaStatus.STOCK_CONFIRMED);
            }
            saga.setUpdatedAt(LocalDateTime.now());
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Saga update failed for order {}", event.getOrderNumber(), e);
            throw e;
        }
    }

    @KafkaListener(topics = KafkaTopics.OUT_OF_STOCK, groupId = KafkaTopics.GROUP_ORDER_SAGA)
    @Transactional
    public void onOutOfStock(OutOfStockEvent event, Acknowledgment ack) {
        if (event.getOrderNumber() == null) {
            ack.acknowledge();
            return;
        }
        try {
            SagaState saga = sagaRepository.findByOrderNumber(event.getOrderNumber()).orElse(null);
            if (saga == null || saga.getStatus() == SagaStatus.DONE || saga.getStatus() == SagaStatus.FAILED) {
                ack.acknowledge();
                return;
            }
            saga.setStatus(SagaStatus.FAILED);
            saga.setUpdatedAt(LocalDateTime.now());
            // Compensation: cancel the order group. Local only — a
            // cross-service compensation (refund, release) would be a new
            // event, deliberately out of scope for L08.
            orderGroupRepository.findById(saga.getOrderId()).ifPresent(order -> {
                order.setOverallStatus(OrderGroupStatus.CANCELLED);
                log.info("Saga FAILED for order {} — compensated via CANCEL", event.getOrderNumber());
            });
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Saga compensation failed for order {}", event.getOrderNumber(), e);
            throw e;
        }
    }
}
