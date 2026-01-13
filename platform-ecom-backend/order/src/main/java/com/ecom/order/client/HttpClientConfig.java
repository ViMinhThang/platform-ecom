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
        return RestClientFactory.createClient(restClientBuilder,
                "http://product-service/api/v1/products",
                ProductServiceClient.class);
    }

    @Bean
    public UserServiceClient userServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder,
                "http://user-service/api/v1/internal/user-service", UserServiceClient.class);
    }

    @Bean
    public InventoryServiceClient inventoryServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder,
                "http://inventory-service/internal/inventory", InventoryServiceClient.class);
    }

    @Bean
    public PromotionServiceClient promotionServiceClient(RestClient.Builder restClientBuilder) {
        return RestClientFactory.createClient(restClientBuilder,
                "http://promotion-service/api/v1/vouchers", PromotionServiceClient.class);
    }

}
