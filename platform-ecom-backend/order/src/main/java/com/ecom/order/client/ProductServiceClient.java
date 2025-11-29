package com.ecom.order.client;

import com.ecom.order.dtos.ProductDTO;
import com.ecom.order.dtos.ProductVariantDTO;
import com.ecom.order.dtos.ReduceStockDTO;
import com.ecom.order.entity.OrderItem;
import com.stripe.model.forwarding.Request;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.util.Collection;
import java.util.List;

@HttpExchange
public interface ProductServiceClient {

    @GetExchange("/get-product-by-seller-id/{sellerId}")
    ResponseEntity<List<ProductDTO>> getProductsBySellerId(@PathVariable("sellerId") Long sellerId);

    @PostExchange("/reduce-stock")
    ResponseEntity<String> reduceStock(@RequestBody List<ReduceStockDTO> reduceStockDTOS);

    @GetExchange("/public/{productId}")
    ResponseEntity<ProductDTO> getProductById(@PathVariable("productId") Long productId);

    @GetExchange("/seller/{productId}/variants/{variantId}")
    ResponseEntity<ProductVariantDTO> getProductVariantById(@PathVariable("productId") Long productId,
            @PathVariable("variantId") Long variantId);
}
