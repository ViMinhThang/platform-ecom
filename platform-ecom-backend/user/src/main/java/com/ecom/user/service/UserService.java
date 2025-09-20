package com.ecom.user.service;

import com.ecom.user.dtos.MessageResponse;
import com.ecom.user.dtos.SignupRequest;
import com.ecom.user.dtos.UserResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<MessageResponse> register(@Valid SignupRequest signUpRequest);

    UserResponse getAllSellers(Pageable pageable);
}
