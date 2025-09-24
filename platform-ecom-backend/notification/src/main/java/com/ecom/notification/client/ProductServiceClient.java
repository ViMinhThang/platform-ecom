package com.ecom.notification.client;


import org.springframework.http.ResponseEntity;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface ProductServiceClient {

    @GetExchange("/count-products")
    public ResponseEntity<Long> getProductCount();
}
