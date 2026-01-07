package com.ecom.user.service.signature;

import com.ecom.user.dtos.*;
import com.ecom.user.dtos.request.LoginRequest;
import com.ecom.user.dtos.request.SignupRequest;
import com.ecom.user.dtos.response.UserInfoResponse;
import jakarta.validation.Valid;

public interface AuthService {
    void register(@Valid SignupRequest signUpRequest);

    AuthenticationResult login(LoginRequest loginRequest);

    UserInfoResponse validate(String token);
}
