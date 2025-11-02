package com.ecom.notification.consumer;


import com.ecom.notification.dtos.PlaceOrderEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
@Slf4j
public class OrderNotificationConsumer {


    @Bean
    public Consumer<PlaceOrderEvent> placeOrderNotification() {
        return message -> {
            log.info("Receive placed order with email{} - Order ID {}", message.getEmail(), message.getOrderId());
        };
    }
}
