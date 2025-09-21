package com.ecom.bff.clients;

import com.ecom.bff.dtos.LoginRequest;
import com.ecom.bff.dtos.UserInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface UserServiceClient {

    @GetExchange("/{id}")
    ResponseEntity<UserInfoResponse> getUserInfo(@PathVariable("id") String userId);
}
