package com.ecom.gateway;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * L09: fixed-window rate limiter, in memory. Single gateway instance only —
 * counters are per-instance, so two replicas would each allow the full
 * quota (documented ceiling; shared Redis quota is the prod answer, and
 * Redis was deliberately NOT re-added for one filter).
 */
@Slf4j
@Component
public class LabRateLimitFilter implements GlobalFilter, Ordered {

    private final int maxRequests;
    private final long windowMs;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    public LabRateLimitFilter(
            @Value("${app.ratelimit.max-requests:100}") int maxRequests,
            @Value("${app.ratelimit.window-ms:10000}") long windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    @Override
    public int getOrder() {
        return -50;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        if (path.startsWith("/labs") || path.startsWith("/actuator/") || path.startsWith("/labhealth")) {
            return chain.filter(exchange);
        }
        String client = clientIp(exchange);
        Window w = windows.computeIfAbsent(client, k -> new Window());
        if (w.allow()) {
            return chain.filter(exchange);
        }
        log.debug("Rate limited {}", client);
        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        exchange.getResponse().getHeaders().set("Retry-After", String.valueOf(windowMs / 1000));
        return exchange.getResponse().setComplete();
    }

    private static String clientIp(ServerWebExchange exchange) {
        String forwarded = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return String.valueOf(exchange.getRequest().getRemoteAddress());
    }

    private final class Window {
        private long startedAt = System.currentTimeMillis();
        private final AtomicInteger count = new AtomicInteger();

        synchronized boolean allow() {
            long now = System.currentTimeMillis();
            if (now - startedAt >= windowMs) {
                startedAt = now;
                count.set(0);
            }
            return count.incrementAndGet() <= maxRequests;
        }
    }
}
