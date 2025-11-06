//package com.ecom.product.client;
//
//import org.springframework.cloud.client.loadbalancer.LoadBalanced;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.client.RestClient;
//import org.springframework.web.client.support.RestClientAdapter;
//import org.springframework.web.service.invoker.HttpServiceProxyFactory;
//
//@Configuration
//public class HttpClientConfig {
//    @Bean
//    @LoadBalanced
//    public RestClient.Builder restClientBuilder() {
//        return RestClient.builder();
//    }
//
//    @Bean
//    public CartServiceClient productServiceClient(RestClient.Builder restClientBuilder) {
//        RestClient restClient = restClientBuilder.baseUrl("http://order-service/api/carts").build();
//        RestClientAdapter adapter = RestClientAdapter.create(restClient);
//        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();
//
//        CartServiceClient service = factory.createClient(CartServiceClient.class);
//        return service;
//    }
//
//}
