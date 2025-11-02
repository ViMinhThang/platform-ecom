package com.ecom.order.producer;

import com.ecom.order.dtos.PlaceOrderEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class OrderNotificationProducer {

    @Autowired
    private StreamBridge streamBridge;

    public void sendPlaceOrderNotification(PlaceOrderEvent placeOrderEvent) {
        boolean sent = streamBridge.send("orderNotification-out-0", placeOrderEvent);
        log.info("📤 Sent order notification event? {}", sent);
    }
}
