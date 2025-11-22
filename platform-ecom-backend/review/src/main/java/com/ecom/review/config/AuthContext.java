package com.ecom.review.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;


@Component
public class AuthContext {

    public Long getUserId(HttpServletRequest request) {
        return Long.valueOf(request.getHeader("X-User-Id"));
    }

    public String getEmail(HttpServletRequest request) {
        return request.getHeader("X-User-Email");
    }

    public List<String> getRoles(HttpServletRequest request) {
        String roles = request.getHeader("X-Roles");
        return roles != null ? Arrays.asList(roles.split(",")) : Collections.emptyList();
    }
}
