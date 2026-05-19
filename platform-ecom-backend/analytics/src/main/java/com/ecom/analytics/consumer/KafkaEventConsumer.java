package com.ecom.analytics.consumer;

import com.ecom.analytics.dto.TrackEventDTO;
import com.ecom.analytics.enums.EventType;
import com.ecom.analytics.service.EventService;
import com.ecom.common.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class KafkaEventConsumer {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(KafkaEventConsumer.class);

    private final EventService eventService;

    public KafkaEventConsumer(EventService eventService) {
        this.eventService = eventService;
    }

    @Bean
    public Consumer<OrderCreatedEvent> orderCreatedConsumer() {
        return event -> {
            log.info("Received OrderCreatedEvent for order: {}", event.getOrderNumber());
            
            // Track purchase event for each item in the order
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
        };
    }
}
