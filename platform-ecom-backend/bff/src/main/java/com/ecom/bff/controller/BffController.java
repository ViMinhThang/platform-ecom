package com.ecom.bff.controller;


import com.ecom.bff.clients.AuthServiceClient;
import com.ecom.bff.clients.UserServiceClient;
import com.ecom.bff.dtos.AuthenticationResult;
import com.ecom.bff.dtos.LoginRequest;
import com.ecom.bff.dtos.UserInfoResponse;
import com.ecom.bff.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bff")
@RequiredArgsConstructor
public class BffController {

    private final AuthServiceClient authServiceClient;
    private final UserServiceClient userServiceClient;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest request) {

        ResponseEntity<ResponseCookie> token = authServiceClient.signin(request);

        String jwtToken = token.getBody().getValue();
        String userId = jwtUtils.getUserIdFromJwtToken(jwtToken);
        UserInfoResponse userInfo = userServiceClient.getUserInfo(userId).getBody();
        AuthenticationResult authenticationResult = new AuthenticationResult(userInfo, token.getBody());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authenticationResult.getJwtCookie().toString())
                .body(authenticationResult.getResponse());
    }

}
