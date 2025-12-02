package com.ecom.common.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

/**
 * Base configuration for creating HTTP service clients.
 * Provides utility methods to reduce duplication across microservices.
 */
public abstract class BaseHttpClientConfig {

    @Bean
    @LoadBalanced
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }

    /**
     * Create a service client with the given configuration.
     * 
     * @param builder     the RestClient builder
     * @param serviceName the service name for load balancing (e.g.,
     *                    "product-service")
     * @param basePath    the base path for the service (e.g., "/api/products")
     * @param clientClass the client interface class
     * @param <T>         the client type
     * @return the configured service client
     */
    protected <T> T createServiceClient(
            RestClient.Builder builder,
            String serviceName,
            String basePath,
            Class<T> clientClass) {

        String baseUrl = String.format("http://%s%s", serviceName, basePath);
        RestClient restClient = builder.baseUrl(baseUrl).build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

        return factory.createClient(clientClass);
    }
}
