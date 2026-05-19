package com.ecom.review.client;

import com.ecom.review.dto.OrderDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface OrderServiceClient {

    @GetExchange("/{orderId}")
    ResponseEntity<OrderDTO.Wrapper> getOrderById(@PathVariable("orderId") Long orderId);
}
