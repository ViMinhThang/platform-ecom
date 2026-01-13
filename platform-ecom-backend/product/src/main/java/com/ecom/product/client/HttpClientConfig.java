package com.ecom.product.client;

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
    public UserServiceClient userServiceClient(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder
                .baseUrl("http://user-service/api/v1/internal/user-service")
                .build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();
        return factory.createClient(UserServiceClient.class);
    }

    @Bean
    public PromotionServiceClient promotionServiceClient(RestClient.Builder restClientBuilder) {
        RestClient restClient = restClientBuilder
                .baseUrl("http://promotion-service/api/v1/internal/promotion")
                .build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();
        return factory.createClient(PromotionServiceClient.class);
    }

    // @Bean
    // public CartServiceClient cartServiceClient(RestClient.Builder
    // restClientBuilder) {
    // RestClient restClient = restClientBuilder
    // .baseUrl("http://order-service/api/carts")
    // .build();
    // RestClientAdapter adapter = RestClientAdapter.create(restClient);
    // HttpServiceProxyFactory factory =
    // HttpServiceProxyFactory.builderFor(adapter).build();
    // return factory.createClient(CartServiceClient.class);
    // }
}
