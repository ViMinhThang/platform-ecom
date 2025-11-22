package com.ecom.user.aspect;

import com.ecom.user.config.AuthContext;
import com.ecom.user.exceptions.APIException;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Aspect
@Component
public class RoleGuardAspect {

    @Autowired
    private AuthContext authContext;

    @Around("@annotation(requireRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint, RequireRole requireRole) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        List<String> roles = authContext.getRoles(request);
        System.out.println(roles.toString());
        if (!roles.contains(requireRole.value())) {
            throw new APIException("Forbidden: missing role " + requireRole.value());
        }

        return joinPoint.proceed();
    }
}