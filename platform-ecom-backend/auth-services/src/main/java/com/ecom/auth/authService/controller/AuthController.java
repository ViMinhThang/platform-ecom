package com.ecom.auth.authService.controller;

import com.ecom.auth.authService.dtos.LoginRequest;
import com.ecom.auth.authService.dtos.MessageResponse;
import com.ecom.auth.authService.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth-service")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<ResponseCookie> authenticateUser(@RequestBody LoginRequest loginRequest) {
        ResponseCookie result = authService.login(loginRequest);
        return new ResponseEntity<ResponseCookie>(result, HttpStatus.OK);
    }

//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
//        return authService.register(signUpRequest);
//    }

    @PostMapping("/signout")
    public ResponseEntity<?> signoutUser() {
        ResponseCookie cookie = authService.logoutUser();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                        cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

//    @GetMapping("/sellers")
//    public ResponseEntity<?> getAllSellers(
//            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber) {
//
//        Sort sortByAndOrder = Sort.by(AppConstants.SORT_USERS_BY).descending();
//        Pageable pageDetails = PageRequest.of(pageNumber ,
//                Integer.parseInt(AppConstants.PAGE_SIZE), sortByAndOrder);
//
//        return ResponseEntity.ok(authService.getAllSellers(pageDetails));
//    }

}