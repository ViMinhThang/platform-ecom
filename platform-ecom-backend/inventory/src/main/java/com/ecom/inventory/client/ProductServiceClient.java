package com.ecom.inventory.client;

import com.ecom.common.util.APIResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange
public interface ProductServiceClient {

    @GetExchange("/api/v1/internal/product-service/seller/{sellerId}/ids")
    ResponseEntity<APIResponse<List<Long>>> getProductIdsBySellerId(@PathVariable("sellerId") Long sellerId);
}
