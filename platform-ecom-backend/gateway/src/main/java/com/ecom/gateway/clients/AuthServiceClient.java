package com.ecom.gateway.clients;

import com.ecom.gateway.dtos.UserInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface AuthServiceClient {

    @GetExchange("/validate")
    ResponseEntity<UserInfoResponse> validate(@CookieValue("ecom") String token);
}
