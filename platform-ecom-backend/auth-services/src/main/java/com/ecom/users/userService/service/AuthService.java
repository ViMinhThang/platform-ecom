package com.ecom.users.userService.service;

import com.ecom.users.userService.dtos.*;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseCookie login(LoginRequest loginRequest);
    ResponseCookie logoutUser();

}