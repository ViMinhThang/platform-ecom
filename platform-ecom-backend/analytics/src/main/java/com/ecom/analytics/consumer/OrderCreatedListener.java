package com.ecom.analytics.consumer;

import com.ecom.analytics.dto.TrackEventDTO;
import com.ecom.analytics.enums.EventType;
import com.ecom.analytics.service.EventService;
import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.OrderCreatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

/**
 * L2: fan-out consumer. Same ORDER_CREATED topic, own group.
 */
@Slf4j
@Component
public class OrderCreatedListener {

    private final EventService eventService;

    public OrderCreatedListener(EventService eventService) {
        this.eventService = eventService;
    }

    @KafkaListener(topics = KafkaTopics.ORDER_CREATED, groupId = KafkaTopics.GROUP_ANALYTICS)
    public void onOrderCreated(OrderCreatedEvent event, Acknowledgment ack) {
        log.info("Received OrderCreatedEvent for order: {}", event.getOrderNumber());
        try {
            event.getItems().forEach(item -> {
                TrackEventDTO trackEvent = new TrackEventDTO();
                trackEvent.setEventType(EventType.PURCHASE);
                trackEvent.setUserId(event.getUserId());
                trackEvent.setProductId(item.getProductId());
                trackEvent.setVariantId(item.getVariantId());
                trackEvent.setQuantity(item.getQuantity());
                trackEvent.setPrice(item.getPrice());
                trackEvent.setTimestamp(System.currentTimeMillis());
                eventService.trackEvent(trackEvent);
            });
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to handle OrderCreatedEvent for order {}", event.getOrderNumber(), e);
            throw e;
        }
    }
}
