package com.ecom.gateway.clients;

import com.ecom.common.util.APIResponse;
import com.ecom.gateway.dtos.UserInfoResponse;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.service.annotation.GetExchange;
import reactor.core.publisher.Mono;

public interface AuthServiceClient {

    @GetExchange("/validate")
    Mono<APIResponse<UserInfoResponse>> validate(@CookieValue("ecom") String token);
}