package com.ecom.user.service.signature;

import com.ecom.user.dtos.*;
import jakarta.validation.Valid;

public interface AuthService {
    void register(@Valid SignupRequest signUpRequest);

    AuthenticationResult login(LoginRequest loginRequest);

    UserInfoResponse validate(String token);
}
