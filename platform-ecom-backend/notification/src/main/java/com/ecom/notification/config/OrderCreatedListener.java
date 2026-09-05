package com.ecom.notification.config;

import com.ecom.common.event.KafkaTopics;
import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.notification.dto.UserDTO;
import com.ecom.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

/**
 * L2: fan-out consumer. Same ORDER_CREATED topic, own group.
 * No user-service lookup: email comes from the event (user-service deleted).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderCreatedListener {

    private final EmailService emailService;

    @KafkaListener(topics = KafkaTopics.ORDER_CREATED, groupId = KafkaTopics.GROUP_NOTIFICATION)
    public void handleOrderCreated(OrderCreatedEvent event, Acknowledgment ack) {
        log.info("Received OrderCreatedEvent for order: {}", event.getOrderNumber());
        try {
            String email = event.getCustomerEmail();
            if (email == null || email.isBlank()) {
                log.warn("Order {} has no customerEmail. Confirmation skipped.", event.getOrderNumber());
                ack.acknowledge();
                return;
            }
            UserDTO user = UserDTO.builder()
                    .id(event.getUserId())
                    .email(email)
                    .build();
            emailService.sendOrderConfirmationEmail(user, event);
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Error processing OrderCreatedEvent for order: {}", event.getOrderNumber(), e);
            throw e;
        }
    }
}
