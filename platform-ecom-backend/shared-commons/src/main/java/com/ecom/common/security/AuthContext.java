package com.ecom.common.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Authentication context helper for extracting user information from request
 * headers.
 * Consolidated from multiple microservices.
 */
@Component
public class AuthContext {

    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String ROLES_HEADER = "X-Roles";
    private static final String EMAIL_HEADER = "X-User-Email";

    /**
     * Extract user ID from request headers.
     * 
     * @param request the HTTP request
     * @return the user ID
     * @throws NumberFormatException if user ID header is not a valid number
     */
    public Long getUserId(HttpServletRequest request) {
        String userIdHeader = request.getHeader(USER_ID_HEADER);
        if (userIdHeader == null || userIdHeader.isEmpty()) {
            throw new IllegalStateException("User ID not found in request headers");
        }
        return Long.valueOf(userIdHeader);
    }

    /**
     * Extract user roles from request headers.
     * 
     * @param request the HTTP request
     * @return list of roles, empty list if no roles found
     */
    public List<String> getRoles(HttpServletRequest request) {
        String rolesHeader = request.getHeader(ROLES_HEADER);
        return rolesHeader != null && !rolesHeader.isEmpty()
                ? Arrays.asList(rolesHeader.split(","))
                : Collections.emptyList();
    }

    /**
     * Extract user email from request headers.
     * 
     * @param request the HTTP request
     * @return the user email, or null if not present
     */
    public String getEmail(HttpServletRequest request) {
        return request.getHeader(EMAIL_HEADER);
    }

    /**
     * Check if user has a specific role.
     * 
     * @param request the HTTP request
     * @param role    the role to check
     * @return true if user has the role
     */
    public boolean hasRole(HttpServletRequest request, String role) {
        return getRoles(request).contains(role);
    }
}
