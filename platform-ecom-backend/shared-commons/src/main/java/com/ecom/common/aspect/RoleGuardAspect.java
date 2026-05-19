package com.ecom.common.aspect;

import com.ecom.common.exception.APIException;
import com.ecom.common.security.AuthContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

/**
 * Aspect for enforcing role-based access control.
 * Consolidated from multiple microservices.
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class RoleGuardAspect {

    private final AuthContext authContext;

    @Around("@annotation(requireRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint, RequireRole requireRole) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            log.error("No request attributes found in context");
            throw new APIException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to get request context");
        }

        HttpServletRequest request = attributes.getRequest();
        List<String> roles = authContext.getRoles(request);
        String requiredRole = requireRole.value();

        log.debug("Checking role access - Required: {}, User has: {}", requiredRole, roles);

        if (!roles.contains(requiredRole)) {
            log.warn("Access denied - Missing role: {}. User roles: {}", requiredRole, roles);
            throw new APIException(
                    HttpStatus.FORBIDDEN,
                    String.format("Access denied: Missing required role '%s'", requiredRole),
                    "FORBIDDEN");
        }

        return joinPoint.proceed();
    }
}
