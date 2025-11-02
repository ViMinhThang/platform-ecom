package com.ecom.gateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.List;
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
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }


    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // ---------------- PRODUCT SERVICE ----------------
                .route("product-public", r -> r.path("/api/products/public/**")
                        .uri("lb://product-service"))
                .route("product-images", r -> r.path("/products/images/**")
                        .uri("lb://product-service"))
                .route("product-admin", r -> r.path("/api/products/admin/**")
                        .filters(f -> f.filter(authFilter))
                        .uri("lb://product-service"))
                .route("product-seller", r -> r.path("/api/products/seller/**")
                        .filters(f -> f.filter(authFilter))
                        .uri("lb://product-service"))
                // ---------------- USER SERVICE ----------------
                .route("user-service", r -> r.path("/api/auth/update-info")
                        .filters(f->f.filter(authFilter))
                        .uri("lb://user-service"))
                .route("user-service", r -> r.path("/api/auth/**")
                        .uri("lb://user-service"))
                .route("user-addresses-private", r -> r.path(
                                "/api/addresses/**"
                        )
                        .and().method("POST", "PUT", "DELETE")
                        .filters(f -> f.filter(authFilter))
                        .uri("lb://user-service"))
                .route("user-addresses-public", r -> r.path(
                                "/api/addresses/**",
                                "/api/addresses/{id}"
                        )
                        .and().method("GET")
                        .uri("lb://user-service"))
                .route("notification-service", r -> r
                        .path("/api/notification/**")
                        .filters(f->f.filter(authFilter))
                        .uri("lb://NOTIFICATION-SERVICE"))
                .route("order-service", r -> r
                        .path("/api/orders/**", "/api/carts/**")
                        .filters(f->f.filter(authFilter))
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