package com.ecom.user.controller;

import com.ecom.user.config.AppConstants;
import com.ecom.user.dtos.LoginRequest;
import com.ecom.user.dtos.MessageResponse;
import com.ecom.user.dtos.SignupRequest;
import com.ecom.user.dtos.UserInfoResponse;
import com.ecom.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return userService.register(signUpRequest);
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserInfoResponse> getUserInfo(@PathVariable("id") String userId) {
        UserInfoResponse result = userService.getUserById(userId);
        return new ResponseEntity<UserInfoResponse>(result, HttpStatus.OK);
    }


    @GetMapping("/sellers")
    public ResponseEntity<?> getAllSellers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber) {

        Sort sortByAndOrder = Sort.by(AppConstants.SORT_USERS_BY).descending();
        Pageable pageDetails = PageRequest.of(pageNumber,
                Integer.parseInt(AppConstants.PAGE_SIZE), sortByAndOrder);

        return ResponseEntity.ok(userService.getAllSellers(pageDetails));
    }
}
