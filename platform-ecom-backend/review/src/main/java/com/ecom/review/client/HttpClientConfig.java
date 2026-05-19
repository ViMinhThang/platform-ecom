package com.ecom.review.client;

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
    public OrderServiceClient orderServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder, "http://order-service/api/v1/admin/orders",
                OrderServiceClient.class);
    }

    @Bean
    public ProductServiceClient productServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder, "http://product-service/api/v1/internal/product-service",
                ProductServiceClient.class);
    }

    @Bean
    public SentimentServiceClient sentimentServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder, "http://sentiment-service/api/v1/sentiment",
                SentimentServiceClient.class);
    }
}
