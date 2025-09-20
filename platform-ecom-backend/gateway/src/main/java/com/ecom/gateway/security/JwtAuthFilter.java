package com.ecom.gateway.security;

import com.ecom.gateway.security.jwt.JwtUtils;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;


@Component
public class JwtAuthFilter implements WebFilter {

    @Autowired
    private JwtUtils jwtUtils;


    @Value("${spring.app.jwtCookieName}")
    private String jwtCookie;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        HttpCookie cookie = exchange.getRequest()
                .getCookies()
                .getFirst(jwtCookie);

        if (cookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = cookie.getValue();
        try {
            Long userId = Long.valueOf(jwtUtils.getUserIdFromToken(token));

            exchange = exchange.mutate()
                    .request(r -> r.headers(h -> h.add("X-User-Id", String.valueOf(userId))))
                    .build();

            return chain.filter(exchange);

        } catch (JwtException e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

    }
}