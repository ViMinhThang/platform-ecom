package com.ecom.gateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;

@Configuration
public class GatewayConfig {

        @Autowired
        private AuthenticationFilter authFilter;

        // @Bean
        // @Primary
        // public RedisRateLimiter publicRateLimiter() {
        // return new RedisRateLimiter(10, 20, 1);
        // }
        //
        // @Bean
        // public RedisRateLimiter authenticatedRateLimiter() {
        // return new RedisRateLimiter(50, 100, 1);
        // }
        //
        // @Bean
        // public KeyResolver hostNameKeyResolver() {
        // return exchange -> Mono.just(
        // Objects.requireNonNull(exchange.getRequest().getRemoteAddress()).getHostName());
        // }

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
                                // ============================================================
                                // AUTHENTICATION & USER SERVICE - /api/v1/auth
                                // ============================================================
                                // Public authentication endpoints
                                .route("auth-login", r -> r
                                                .path("/api/v1/auth/login")
                                                .uri("lb://user-service"))

                                .route("auth-signup", r -> r
                                                .path("/api/v1/auth/signup")
                                                .uri("lb://user-service"))

                                .route("auth-refresh", r -> r
                                                .path("/api/v1/auth/refresh")

                                                .uri("lb://user-service"))

                                .route("auth-forgot-password", r -> r
                                                .path("/api/v1/auth/forgot-password", "/api/v1/auth/reset-password")
                                                .uri("lb://user-service"))

                                .route("auth-protected", r -> r
                                                .path("/api/v1/auth/logout", "/api/v1/auth/change-password",
                                                                "/api/v1/auth/profile", "/api/v1/auth/profile")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://user-service"))

                                // ============================================================
                                // USER PROFILE & ADDRESSES - /api/v1/users
                                // ============================================================

                                .route("user-profile", r -> r
                                                .path("/api/v1/users/me", "/api/v1/users/me/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://user-service"))

                                .route("user-addresses", r -> r
                                                .path("/api/v1/users/addresses", "/api/v1/users/addresses/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://user-service"))

                                // Admin user management
                                .route("admin-users", r -> r
                                                .path("/api/v1/admin/users/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://user-service"))

                                // ============================================================
                                // PRODUCT CATALOG - /api/v1/products
                                // ============================================================

                                // Public product endpoints
                                .route("products-public", r -> r
                                                .path("/api/v1/products", "/api/v1/products/**")
                                                .uri("lb://product-service"))

                                // Seller product management
                                .route("seller-products", r -> r
                                                .path("/api/v1/sellers/products", "/api/v1/sellers/products/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://product-service"))

                                // Admin product management
                                .route("admin-products", r -> r
                                                .path("/api/v1/admin/products/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://product-service"))

                                // ============================================================
                                // CATEGORIES - /api/v1/categories
                                // ============================================================

                                // Public categories
                                .route("categories-public", r -> r
                                                .path("/api/v1/categories", "/api/v1/categories/**")
                                                .uri("lb://product-service"))

                                // Seller category management
                                .route("seller-categories", r -> r
                                                .path("/api/v1/sellers/categories", "/api/v1/sellers/categories/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://product-service"))

                                // Admin category management
                                .route("admin-categories", r -> r
                                                .path("/api/v1/admin/categories/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://product-service"))

                                // ============================================================
                                // SHOPPING CART - /api/v1/cart
                                // ============================================================

                                .route("shopping-cart", r -> r
                                                .path("/api/v1/cart", "/api/v1/cart/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://order-service"))

                                // ============================================================
                                // ORDER GROUPS - /api/v1/order-groups
                                // ============================================================

                                .route("order-groups", r -> r
                                                .path("/api/v1/order-groups", "/api/v1/order-groups/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://order-service"))

                                // ============================================================
                                // SUB ORDERS - /api/v1/sub-orders
                                // ============================================================

                                .route("sub-orders", r -> r
                                                .path("/api/v1/sub-orders", "/api/v1/sub-orders/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://order-service"))

                                // ============================================================
                                // PAYMENT WEBHOOKS - /api/v1/webhooks/payments
                                // ============================================================

                                .route("payment-webhooks", r -> r
                                                .path("/api/v1/webhooks/payments/**")
                                                .uri("lb://order-service"))

                                // ============================================================
                                // ORDERS (Legacy/General) - /api/v1/orders
                                // ============================================================

                                // Customer orders
                                .route("customer-orders", r -> r
                                                .path("/api/v1/orders", "/api/v1/orders/{id}",
                                                                "/api/v1/orders/{id}/cancel")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://order-service"))

                                // Seller order management
                                .route("seller-orders", r -> r
                                                .path("/api/v1/sellers/orders", "/api/v1/sellers/orders/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://order-service"))

                                // Admin order management
                                .route("admin-orders", r -> r
                                                .path("/api/v1/admin/orders/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://order-service"))

                                // ============================================================
                                // REVIEWS - /api/v1/reviews
                                // ============================================================

                                // Public reviews (read-only)
                                .route("reviews-public", r -> r
                                                .path("/api/v1/products/{productId}/reviews")
                                                .uri("lb://review-service"))

                                // Authenticated review actions (create, update, delete)
                                .route("reviews-authenticated", r -> r
                                                .path("/api/v1/reviews", "/api/v1/reviews/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://review-service"))

                                // Admin review moderation
                                .route("admin-reviews", r -> r
                                                .path("/api/v1/admin/reviews/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://review-service"))

                                // ============================================================
                                // NOTIFICATIONS - /api/v1/notifications
                                // ============================================================

                                .route("notifications", r -> r
                                                .path("/api/v1/notifications", "/api/v1/notifications/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://notification-service"))

                                // ============================================================
                                // SERVICE DISCOVERY (Internal/Admin only)
                                // ============================================================

                                .route("eureka-web", r -> r
                                                .path("/eureka/web")
                                                .filters(f -> f.rewritePath("/eureka/web", "/"))
                                                .uri("http://localhost:8761"))

                                .route("eureka-static", r -> r
                                                .path("/eureka/**")
                                                .uri("http://localhost:8761"))
                                .build();
        }
}