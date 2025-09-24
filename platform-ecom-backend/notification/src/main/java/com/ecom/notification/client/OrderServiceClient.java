package com.ecom.notification.client;


import org.springframework.http.ResponseEntity;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface OrderServiceClient {

    @GetExchange("/order-revenue")
    public ResponseEntity<Double>getTotalRevenue();

    @GetExchange("/count-orders")
    public ResponseEntity<Long>getCountOrders();
}
