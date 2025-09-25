package com.ecom.user.service;

import com.ecom.user.dtos.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<MessageResponse> register(@Valid SignupRequest signUpRequest);

    UserResponse getAllSellers(Pageable pageable);
    @Query("SELECT u.userId FROM User u WHERE u.userName = :username")

    UserInfoResponse getUserById(String userId);

    AuthenticationResult login(LoginRequest loginRequest);

    UserInfoResponse validate(String token);

    UserInfoResponse updateUserById(UpdateUserRequest updateUserRequest,Long userId);
}
