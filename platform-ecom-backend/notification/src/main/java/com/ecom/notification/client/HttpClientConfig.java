package com.ecom.notification.client;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class HttpClientConfig {

    @Bean
    @LoadBalanced
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }

    @Bean
    public ProductServiceClient productServiceClient(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.baseUrl("http://product-service/api/products").build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        ProductServiceClient service = factory.createClient(ProductServiceClient.class);
        return service;
    }


    @Bean
    public OrderServiceClient orderServiceClient(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.baseUrl("http://order-service/api/orders").build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        OrderServiceClient service = factory.createClient(OrderServiceClient.class);
        return service;
    }
}
