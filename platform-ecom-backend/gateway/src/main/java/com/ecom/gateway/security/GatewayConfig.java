package com.ecom.gateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import reactor.core.publisher.Mono;

import java.util.Objects;


@Configuration
public class GatewayConfig {
    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(10, 20, 1);
    }

    @Autowired
    private AuthenticationFilter authFilter;
    @Bean
    public KeyResolver hostNameKeyResolver() {
        return exchange -> Mono.just(
                Objects.requireNonNull(exchange.getRequest().getRemoteAddress()).getHostName());
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // ---------------- PRODUCT SERVICE ----------------
                .route("product-public", r -> r.path("/api/product/public/**")
                        .uri("lb://product-service"))
                .route("product-admin", r -> r.path("/api/product/admin/**")
                        .filters(f -> f.filter(authFilter))
                        .uri("lb://product-service"))
                .route("product-seller", r -> r.path("/api/product/seller/**")
                        .filters(f -> f.filter(authFilter))
                        .uri("lb://product-service"))

                // ---------------- USER SERVICE ----------------
                .route("user-service", r -> r.path("/api/auth/**")
                        .uri("lb://user-service"))
                .route("user-addresses", r -> r.path("/api/addresses/**")
                        .uri("lb://user-service"))

                .route("auth-service", r -> r
                        .uri("lb://AUTH-SERVICE"))
                .route("bbf-service", r -> r
                        .path("/api/bff/**")
                        .uri("lb://BFF-SERVICE"))
                .route("order-service", r -> r
                        .path("/api/orders/**", "/api/cart/**")
                        .uri("lb://ORDER-SERVICE"))
                .route("eureka-server", r -> r
                        .path("/eureka/main")
                        .filters(f -> f.rewritePath("/eureka/main", "/"))
                        .uri("http://localhost:8761"))
                .route("eureka-server-static", r -> r
                        .path("/eureka/**")
                        .uri("http://localhost:8761"))
                .build();
    }
}