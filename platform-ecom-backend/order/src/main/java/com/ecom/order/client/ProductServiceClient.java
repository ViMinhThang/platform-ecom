package com.ecom.order.client;

import com.ecom.common.util.APIResponse;
import com.ecom.order.dtos.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.*;

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

    @GetExchange("/public/variants/{variantId}")
    ResponseEntity<APIResponse<ProductVariantDTO>> getPublicVariantById(@PathVariable("variantId") Long variantId);
}
