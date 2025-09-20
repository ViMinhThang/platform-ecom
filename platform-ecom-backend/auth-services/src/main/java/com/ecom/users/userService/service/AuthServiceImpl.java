package com.ecom.users.userService.service;

import com.ecom.users.userService.Entity.Role;
import com.ecom.users.userService.Entity.User;
import com.ecom.users.userService.dtos.*;
import com.ecom.users.userService.exceptions.ResourceNotFoundException;
import com.ecom.users.userService.repositories.UserRepository;
import com.ecom.users.userService.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import java.util.List;

public class AuthServiceImpl implements AuthService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;


    @Override
    public ResponseCookie login(LoginRequest loginRequest) {
        Long userId = userRepository.findUserIdByUserName(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "User name", loginRequest.getUsername()));

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userId);

        return jwtCookie;
    }

    @Override
    public ResponseEntity<MessageResponse> register(SignupRequest signUpRequest) {
        return null;
    }

    @Override
    public ResponseCookie logoutUser() {
        return jwtUtils.getCleanJwtCookie();
    }

    @Override
    public UserResponse getAllSellers(Pageable pageable) {
        return null;
    }
}
