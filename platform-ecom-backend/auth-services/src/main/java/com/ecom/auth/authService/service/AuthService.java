package com.ecom.auth.authService.service;

import com.ecom.auth.authService.dtos.LoginRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseCookie login(LoginRequest loginRequest);
    ResponseCookie logoutUser();

}