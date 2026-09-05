package com.ecom.gateway;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

/**
 * L09 lab scaffolding — mints Bearer tokens WITHOUT any credential check.
 * Exists so labs can exercise the JWT edge without a user service.
 * NEVER expose this in prod; it is the keys to the building with no lock.
 */
@RestController
@RequestMapping("/labs")
public class TokenController {

    private final SecretKey key;
    private final long ttlMs;

    public TokenController(
            @Value("${app.jwt.secret:lab-secret-32B-minimum-change-me-00}") String secret,
            @Value("${app.jwt.ttl-ms:3600000}") long ttlMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttlMs = ttlMs;
    }

    @PostMapping(value = "/token", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Map<String, String>> mint(@RequestParam(defaultValue = "1") String userId) {
        String token = Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlMs))
                .signWith(key)
                .compact();
        return Mono.just(Map.of("accessToken", token, "tokenType", "Bearer"));
    }
}
