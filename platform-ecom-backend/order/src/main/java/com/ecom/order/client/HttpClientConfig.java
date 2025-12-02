package com.ecom.order.client;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import com.ecom.common.client.RestClientFactory;

@Configuration
public class HttpClientConfig {
    @Bean
    @LoadBalanced
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }

    @Bean
    public ProductServiceClient productServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder, "http://product-service/api/products",
                ProductServiceClient.class);
    }

    @Bean
    public UserServiceClient userServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder, "http://user-service/api", UserServiceClient.class);
    }

}
