package com.ecom.user.controller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.security.AuthContext;
import com.ecom.common.util.*;
import com.ecom.user.dtos.*;
import com.ecom.user.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final AuthContext authContext;

    @GetMapping
    // @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<UserResponse>> getAllUsers(PaginationRequest paginationRequest) {
        UserResponse userResponse = authService.getAllUsers(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("Users retrieved successfully", userResponse);
    }

    @PostMapping
    public ResponseEntity<APIResponse<UserDTO>> createUser(@RequestBody UserDTO userDTO) {
        UserDTO savedUser = authService.createUser(userDTO);
        return ResponseBuilder.createdWithMessage("User created successfully", savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<APIResponse<AuthenticationResult>> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthenticationResult result = authService.login(loginRequest);
        APIResponse<AuthenticationResult> response = new APIResponse<>("Login successful", true, result);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, result.getJwtCookie().toString()).body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
         authService.register(signUpRequest);
         return new ResponseEntity<MessageResponse>(new MessageResponse("Register successfully"), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<UserInfoResponse>> getUserInfo(@PathVariable("id") String userId) {
        UserInfoResponse result = authService.getUserById(userId);
        return ResponseBuilder.success("User info retrieved successfully", result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<UserDTO>> updateUserByAdmin(@PathVariable("id") Long userId,
            @RequestBody UserDTO userDTO) {
        UserDTO savedUser = authService.updateUserByAdmin(userId, userDTO);
        return ResponseBuilder.success("User updated successfully", savedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<UserDTO>> deleteUserById(@PathVariable("id") Long userId) {
        UserDTO deletedUser = authService.deleteUser(userId);
        return ResponseBuilder.success("User deleted successfully", deletedUser);
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<APIResponse<String>> uploadUserImage(@PathVariable("id") Long userId,
            @RequestParam("file") MultipartFile image) {
        String imageUrl = authService.uploadUserImage(userId, image);
        return ResponseBuilder.success("User image uploaded successfully", imageUrl);
    }

    @GetMapping("/validate")
    public ResponseEntity<APIResponse<UserInfoResponse>> validateToken(@CookieValue("ecom") String jwtToken) {
        UserInfoResponse response = authService.validate(jwtToken);
        return ResponseBuilder.success("Token validated successfully", response);
    }

    @GetMapping("/get-email-by-user-id/{userId}")
    public ResponseEntity<APIResponse<String>> getEmailByUserId(@PathVariable Long userId) {
        UserInfoResponse user = authService.getUserById(String.valueOf(userId));
        return ResponseBuilder.success("Email retrieved successfully", user.getEmail());
    }

    @PutMapping("/update-info")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<UserInfoResponse>> updateUserInfo(
            @RequestBody UpdateUserRequest updateUserRequest,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        UserInfoResponse user = authService.updateUserById(updateUserRequest, userId);
        return ResponseBuilder.success("User info updated successfully", user);
    }

    @GetMapping("/roles")
    // @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<RoleResponse>> getAllRoles() {
        RoleResponse roleResponse = authService.getAllRoles();
        return ResponseBuilder.success("Roles retrieved successfully", roleResponse);
    }

}
