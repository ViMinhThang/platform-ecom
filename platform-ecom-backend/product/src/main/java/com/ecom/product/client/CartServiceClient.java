//package com.ecom.product.client;
//
//import com.ecom.product.dto.ProductDTO;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.service.annotation.HttpExchange;
//import org.springframework.web.service.annotation.PostExchange;
//
//import java.util.List;
//
//@HttpExchange
//public interface CartServiceClient {
//
//    @PostExchange("/update-product-in-carts")
//    ResponseEntity<String> updateProductInCarts(@RequestBody ProductDTO map);
//
//    @PostExchange("/delete-product-from-carts")
//    ResponseEntity<String> deleteProductFromCart(@RequestBody ProductDTO map);
//}
