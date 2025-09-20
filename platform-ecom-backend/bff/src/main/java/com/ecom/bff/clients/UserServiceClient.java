package com.ecom.bff.clients;

import com.ecom.bff.dtos.LoginRequest;
import com.ecom.bff.dtos.UserInfoResponse;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface UserServiceClient {

    @GetExchange("/me")
    UserInfoResponse getUserInfo(LoginRequest loginRequest);
}
