package com.ecom.review.client;

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
    public OrderServiceClient orderServiceClient(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.baseUrl("http://order-service/api/orders").build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        return factory.createClient(OrderServiceClient.class);
    }

    @Bean
    public ProductServiceClient productServiceClient(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder.baseUrl("http://product-service/api/products").build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        return factory.createClient(ProductServiceClient.class);
    }
}
