package com.ecom.auth.authService.security.jwt;

import io.jsonwebtoken.Jwts;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${spring.app.jwtSecret}")
    private String jwtSecret;

    @Value("${spring.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private SecretKey key;

    @Value("${spring.ecom.app.jwtCookieName}")
    private String jwtCookie;

    private static final long EXPIRATION_TIME = 30L * 24 * 60 * 60 * 1000;

    @PostConstruct
    private void init() {
        byte[] keyByte = jwtSecret.getBytes(StandardCharsets.UTF_8);
        this.key = new SecretKeySpec(keyByte, "HmacSHA256");
    }


    public String generateToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date(System.currentTimeMillis()
                ))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public ResponseCookie generateJwtCookie(String userId) {
        String token = generateToken(userId);
        ResponseCookie cookie = ResponseCookie.from(jwtCookie, String.valueOf(userId))
                .path("/api")
                .maxAge(24 * 60 * 60)
                .httpOnly(false)
                .secure(false)
                .build();
        return cookie;
    }


    public ResponseCookie getCleanJwtCookie() {
        ResponseCookie cookie = ResponseCookie.from(jwtCookie, null)
                .path("/api")
                .build();
        return cookie;
    }
}