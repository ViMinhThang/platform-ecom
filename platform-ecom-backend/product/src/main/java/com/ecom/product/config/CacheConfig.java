package com.ecom.product.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * Caching configuration for the product microservice.
 * Enables caching for frequently accessed data like categories and active products.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("categories"),
            new ConcurrentMapCache("products"),
            new ConcurrentMapCache("productDetails"),
            new ConcurrentMapCache("activeProducts")
        ));
        return cacheManager;
    }
}
