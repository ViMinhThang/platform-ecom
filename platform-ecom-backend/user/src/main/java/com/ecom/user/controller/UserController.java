package com.ecom.user.controller;

import com.ecom.user.aspect.RequireRole;
import com.ecom.user.config.AppConstants;
import com.ecom.user.config.AuthContext;
import com.ecom.user.dtos.*;
import com.ecom.user.entity.User;
import com.ecom.user.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {


    @Autowired
    AuthService authService;

    @Autowired
    AuthContext authContext;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthenticationResult result = authService.login(loginRequest);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                        result.getJwtCookie().toString())
                .body(result.getResponse());
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.register(signUpRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserInfoResponse> getUserInfo(@PathVariable("id") String userId) {
        UserInfoResponse result = authService.getUserById(userId);
        return new ResponseEntity<UserInfoResponse>(result, HttpStatus.OK);
    }

    @GetMapping("/validate")
    public ResponseEntity<UserInfoResponse> validateToken(@CookieValue("ecom") String jwtToken) {
        UserInfoResponse response = authService.validate(jwtToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sellers")
    public ResponseEntity<?> getAllSellers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber) {

        Sort sortByAndOrder = Sort.by(AppConstants.SORT_USERS_BY).descending();
        Pageable pageDetails = PageRequest.of(pageNumber,
                Integer.parseInt(AppConstants.PAGE_SIZE), sortByAndOrder);

        return ResponseEntity.ok(authService.getAllSellers(pageDetails));
    }

    @GetMapping("/get-email-by-user-id/{userId}")
    public ResponseEntity<String> getEmailByUserId(@PathVariable Long userId) {
        UserInfoResponse user = authService.getUserById(String.valueOf(userId));
        return new ResponseEntity<String>(user.getEmail(), HttpStatus.OK);
    }

    @PutMapping("/update-info")
    @RequireRole("ROLE_USER")
    public ResponseEntity<UserInfoResponse>updateUserInfo(@RequestBody UpdateUserRequest updateUserRequest,HttpServletRequest request){
        Long userId = authContext.getUserId(request);
        UserInfoResponse user = authService.updateUserById(updateUserRequest,userId);
        return new ResponseEntity<UserInfoResponse>(user,HttpStatus.OK);
    }

}
