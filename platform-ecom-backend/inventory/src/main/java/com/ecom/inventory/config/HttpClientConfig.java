package com.ecom.inventory.config;

import com.ecom.common.client.RestClientFactory;
import com.ecom.inventory.client.ProductServiceClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.web.client.RestClient;

@Configuration
public class HttpClientConfig {

    @Bean
    @LoadBalanced
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }

    @Bean
    public ProductServiceClient productServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder, "http://product-service", ProductServiceClient.class);
    }
}
