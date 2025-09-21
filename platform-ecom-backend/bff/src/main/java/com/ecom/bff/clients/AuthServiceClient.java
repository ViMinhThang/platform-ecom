package com.ecom.bff.clients;
import com.ecom.bff.dtos.LoginRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface AuthServiceClient {

    @PostExchange("/signin")
    ResponseEntity<ResponseCookie> signin(@RequestBody LoginRequest request);
}