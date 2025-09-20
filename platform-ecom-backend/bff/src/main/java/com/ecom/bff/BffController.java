package com.ecom.bff;


import com.ecom.bff.clients.AuthServiceClient;
import com.ecom.bff.clients.UserServiceClient;
import com.ecom.bff.dtos.AuthenticationResult;
import com.ecom.bff.dtos.LoginRequest;
import com.ecom.bff.dtos.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class BffController {

    private final AuthServiceClient authServiceClient;
    private final UserServiceClient userServiceClient;


    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest request) {

        ResponseEntity<ResponseCookie> token = authServiceClient.signin(request);

        UserInfoResponse userInfo = userServiceClient.getUserInfo(request);
        AuthenticationResult authenticationResult = new AuthenticationResult(userInfo, token.getBody());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authenticationResult.getJwtCookie().toString())
                .body(authenticationResult.getResponse());
    }
}
