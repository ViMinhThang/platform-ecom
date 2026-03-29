package com.ecom.gateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

        @Value("${eureka.discovery.web-url:http://localhost:8761}")
        private String eurekaUrl;

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
                                                .path("/api/v1/auth/forgot-password", "/api/v1/auth/verify-otp",
                                                        "/v1/auth/forgot-password", "/v1/auth/verify-otp")
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
                                .route("admin-internal", r -> r
                                                .path("/api/v1/internal/user-service/**")
                                                .uri("lb://user-service"))

                                // Internal product service endpoints
                                .route("internal-product", r -> r
                                                .path("/api/v1/internal/product-service/**")
                                                .uri("lb://product-service"))

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
                                // SALE CAMPAIGNS - /api/v1/sale-campaigns
                                // ============================================================

                                // Public sale campaigns (view active campaigns, get by slug, items)
                                .route("sale-campaigns-public", r -> r
                                                .path("/api/v1/sale-campaigns", "/api/v1/sale-campaigns/**")
                                                .uri("lb://product-service"))

                                // Admin sale campaigns management
                                .route("admin-sale-campaigns", r -> r
                                                .path("/api/v1/admin/sale-campaigns", "/api/v1/admin/sale-campaigns/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://product-service"))

                                // Admin flash sales management
                                .route("admin-flash-sales", r -> r
                                                .path("/api/v1/admin/flash-sales", "/api/v1/admin/flash-sales/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://product-service"))

                                // ============================================================
                                // INVENTORY - /api/v1/inventory
                                // ============================================================

                                // Public inventory (stock check)
                                .route("inventory-public", r -> r
                                                .path("/api/v1/inventory", "/api/v1/inventory/**")
                                                .uri("lb://inventory-service"))

                                // Seller inventory management
                                .route("seller-inventory", r -> r
                                                .path("/api/v1/sellers/inventory", "/api/v1/sellers/inventory/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://inventory-service"))

                                // Admin inventory management
                                .route("admin-inventory", r -> r
                                                .path("/api/v1/admin/inventory/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://inventory-service"))

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

                                // Admin analytics management
                                .route("admin-analytics", r -> r
                                                .path("/api/v1/admin/analytics", "/api/v1/admin/analytics/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://order-service"))

                                // ============================================================
                                // REVIEWS - /api/v1/reviews
                                // ============================================================

                                // Public reviews (read-only) - summary and product reviews
                                .route("reviews-public", r -> r
                                                .path("/api/v1/reviews/public/**")
                                                .filters(f -> f
                                                                .rewritePath("/api/v1/reviews/(?<segment>.*)",
                                                                                "/api/reviews/${segment}"))
                                                .uri("lb://review-service"))

                                // Public reviews (legacy route for product reviews)
                                .route("reviews-product-public", r -> r
                                                .path("/api/v1/products/{productId}/reviews")
                                                .uri("lb://review-service"))

                                // Authenticated review actions (create, update, delete)
                                .route("reviews-authenticated", r -> r
                                                .path("/api/v1/reviews", "/api/v1/reviews/**")
                                                .filters(f -> f
                                                                .rewritePath("/api/v1/reviews(?<segment>.*)",
                                                                                "/api/reviews${segment}")
                                                                .filter(authFilter))
                                                .uri("lb://review-service"))

                                // Seller review endpoints (protected)
                                .route("reviews-seller", r -> r
                                                .path("/api/v1/reviews/seller/**")
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
                                                .path("/api/v1/notifications", "/api/v1/notifications/**",
                                                        "/v1/notifications", "/v1/notifications/**")
                                                .uri("lb://notification-service"))

                                // ============================================================
                                // CHATBOT - /api/v1/chatbot
                                // ============================================================

                                // Public chatbot endpoints - chat and product summaries
                                .route("chatbot-public", r -> r
                                                .path("/api/v1/chatbot/chat", "/api/v1/chatbot/product/*/summary",
                                                                "/api/v1/chatbot/health")
                                                .uri("lb://chatbot-service"))

                                // Admin chatbot endpoints - embedding management
                                .route("chatbot-admin", r -> r
                                                .path("/api/v1/chatbot/embeddings/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://chatbot-service"))

                                // ============================================================
                                // PROMOTIONS & VOUCHERS - /api/v1/vouchers
                                // ============================================================

                                // Public voucher endpoints
                                .route("vouchers-public", r -> r
                                                .path("/api/v1/vouchers/auto-apply", "/api/v1/vouchers/code/**", "/api/v1/vouchers/available")
                                                .uri("lb://promotion-service"))

                                // Authenticated voucher actions
                                .route("vouchers-authenticated", r -> r
                                                .path("/api/v1/vouchers/validate/**", "/api/v1/vouchers/calculate",
                                                                "/api/v1/vouchers/apply")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://promotion-service"))

                                // Admin voucher management
                                .route("admin-vouchers", r -> r
                                                .path("/api/v1/admin/vouchers/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://promotion-service"))

                                // ============================================================
                                // SERVICE DISCOVERY (Internal/Admin only)
                                // ============================================================

                                .route("eureka-web", r -> r
                                                .path("/eureka/web")
                                                .filters(f -> f.rewritePath("/eureka/web", "/"))
                                                .uri(eurekaUrl))

                                .route("eureka-static", r -> r
                                                .path("/eureka/**")
                                                .uri(eurekaUrl))

                                // ============================================================
                                // ANALYTICS & RECOMMENDATIONS - /api/v1/analytics
                                // ============================================================

                                // Public event tracking
                                .route("analytics-events", r -> r
                                                .path("/api/v1/analytics/events", "/api/v1/analytics/events/**")
                                                .uri("lb://analytics-service"))

                                // Seller analytics (protected)
                                .route("seller-analytics", r -> r
                                                .path("/api/v1/analytics/sellers/**")
                                                .filters(f -> f
                                                                .filter(authFilter))
                                                .uri("lb://analytics-service"))

                                // Recommendations (from recommendation-service)
                                .route("recommendations", r -> r
                                                .path("/api/v1/recommendations/**")
                                                .uri("lb://recommendation-service"))

                                .build();
        }
}