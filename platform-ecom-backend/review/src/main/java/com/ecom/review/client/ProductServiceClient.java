package com.ecom.review.client;

import com.ecom.review.dto.ProductDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface ProductServiceClient {

    @GetExchange("/{productId}")
    ResponseEntity<ProductDTO> getProductById(@PathVariable("productId") Long productId);
}
