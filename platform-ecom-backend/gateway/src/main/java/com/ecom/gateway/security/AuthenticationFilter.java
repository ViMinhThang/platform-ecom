package com.ecom.gateway.security;

import com.ecom.gateway.clients.AuthServiceClient;
import com.ecom.gateway.dtos.UserInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


@Component
public class AuthenticationFilter implements GatewayFilter {


    @Autowired
    private AuthServiceClient authServiceClient;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        HttpCookie cookie = exchange.getRequest().getCookies().getFirst("ecom");

        if (cookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String cookieHeader = "ecom=" + cookie.getValue();
        ResponseEntity<UserInfoResponse> response = authServiceClient.validate(cookieHeader);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            UserInfoResponse userInfo = response.getBody();

            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Id", String.valueOf(userInfo.getId()))
                    .header("X-Roles", String.join(",", userInfo.getRoles()))
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
