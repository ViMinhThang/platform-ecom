package com.ecom.review.client;

import com.ecom.review.dto.ProductDTO;
import com.ecom.common.util.APIResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange
public interface ProductServiceClient {

    @GetExchange("/{productId}")
    ResponseEntity<ProductDTO> getProductById(@PathVariable("productId") Long productId);

    @GetExchange("/seller/{sellerId}/ids")
    ResponseEntity<APIResponse<List<Long>>> getProductIdsBySellerId(@PathVariable("sellerId") Long sellerId);
}
