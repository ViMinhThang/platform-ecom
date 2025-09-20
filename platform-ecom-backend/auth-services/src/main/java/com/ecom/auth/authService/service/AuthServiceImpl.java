package com.ecom.auth.authService.service;

import com.ecom.auth.authService.dtos.LoginRequest;
import com.ecom.auth.authService.dtos.MessageResponse;
import com.ecom.auth.authService.exceptions.ResourceNotFoundException;
import com.ecom.auth.authService.repositories.AuthRepository;
import com.ecom.auth.authService.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {


    @Autowired
    AuthRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;


    @Override
    public ResponseCookie login(LoginRequest loginRequest) {
        Long userId = userRepository.findUserIdByUserName(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "User name", loginRequest.getUsername()));

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(String.valueOf(userId));

        return jwtCookie;
    }

    @Override
    public ResponseCookie logoutUser() {
        return jwtUtils.getCleanJwtCookie();
    }
}
