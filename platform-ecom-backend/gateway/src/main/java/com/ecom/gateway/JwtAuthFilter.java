package com.ecom.gateway;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * L09: edge auth. Validates the Bearer JWT and forwards the subject as
 * X-User-Id — downstream services trust the header and never see tokens.
 * Trust boundary is THIS filter: nothing behind the gateway is reachable
 * except through it (compose exposes only :8080+X).
 *
 * Lab scaffolding only: tokens come from POST /labs/token (TokenController).
 * Real login (user service, passwords, refresh) is out of scope.
 */
@Slf4j
@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    // "/labs" prefix covers /labs/token, /labs.html (lab console, no build).
    // /labhealth is the console's same-origin health proxy (CORS workaround).
    private static final List<String> OPEN_PATHS = List.of("/labs", "/actuator/", "/labhealth");

    private final SecretKey key;

    public JwtAuthFilter(@Value("${app.jwt.secret:lab-secret-32B-minimum-change-me-00}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public int getOrder() {
        return -100;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        if (OPEN_PATHS.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }
        String auth = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }
        try {
            Jws<Claims> jws = Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(auth.substring(7));
            String userId = jws.getPayload().getSubject();
            if (userId == null || userId.isBlank()) {
                return unauthorized(exchange);
            }
            return chain.filter(exchange.mutate()
                    .request(r -> r.header("X-User-Id", userId))
                    .build());
        } catch (Exception e) {
            log.debug("JWT rejected for {}: {}", path, e.getMessage());
            return unauthorized(exchange);
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
