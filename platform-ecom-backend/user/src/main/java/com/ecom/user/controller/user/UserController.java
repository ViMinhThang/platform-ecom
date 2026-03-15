package com.ecom.user.controller.user;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.security.AuthContext;
import com.ecom.common.util.*;
import com.ecom.user.dtos.*;
import com.ecom.user.dtos.request.ForgotPasswordRequest;
import com.ecom.user.dtos.request.LoginRequest;
import com.ecom.user.dtos.request.SignupRequest;
import com.ecom.user.dtos.request.UpdateUserRequest;
import com.ecom.user.dtos.request.VerifyOtpRequest;
import com.ecom.user.dtos.response.MessageResponse;
import com.ecom.user.dtos.response.OtpResponse;
import com.ecom.user.dtos.response.UserInfoResponse;
import com.ecom.user.service.signature.AuthService;
import com.ecom.user.service.signature.ForgotPasswordService;
import com.ecom.user.service.signature.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserService userService;
    private final ForgotPasswordService forgotPasswordService;
    private final AuthContext authContext;

    /**
     * POST /api/v1/auth/login
     * Public endpoint for user authentication
     */
    @PostMapping("/auth/login")
    public ResponseEntity<APIResponse<AuthenticationResult>> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthenticationResult result = authService.login(loginRequest);
        APIResponse<AuthenticationResult> response = new APIResponse<>("Login successful", true, result);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.getJwtCookie().toString())
                .body(response);
    }

    /**
     * POST /api/v1/auth/signup
     * Public endpoint for user registration
     */
    @PostMapping("/auth/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        authService.register(signUpRequest);
        return new ResponseEntity<>(new MessageResponse("Register successfully"), HttpStatus.OK);
    }

    /**
     * POST /api/v1/auth/forgot-password
     * Public endpoint to request password reset OTP
     */
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<APIResponse<OtpResponse>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        OtpResponse result = forgotPasswordService.generateOtp(request);
        return ResponseBuilder.success("OTP sent successfully", result);
    }

    /**
     * POST /api/v1/auth/verify-otp
     * Public endpoint to verify OTP and reset password
     */
    @PostMapping("/auth/verify-otp")
    public ResponseEntity<APIResponse<OtpResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        OtpResponse result = forgotPasswordService.verifyOtpAndResetPassword(request);
        return ResponseBuilder.success("Password reset successfully", result);
    }

    /**
     * POST /api/v1/auth/logout
     * Protected endpoint for user logout
     */
    @PostMapping("/auth/logout")
    @RequireRole("ROLE_USER")
    public ResponseEntity<MessageResponse> logout(HttpServletRequest request) {
        // Implement logout logic (clear cookie, invalidate token, etc.)
        return ResponseEntity.ok(new MessageResponse("Logout successful"));
    }

    /**
     * GET /api/v1/auth/profile
     * Protected endpoint to get current user profile
     */
    @GetMapping("/auth/profile")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<UserInfoResponse>> getCurrentUserProfile(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        UserInfoResponse result = userService.getMyProfile(userId);
        return ResponseBuilder.success("User profile retrieved successfully", result);
    }

    @GetMapping("/auth/validate")
    public ResponseEntity<APIResponse<UserInfoResponse>> validateToken(@CookieValue("ecom") String jwtToken) {
        UserInfoResponse response = authService.validate(jwtToken);
        return ResponseBuilder.success("Token validated successfully", response);
    }

    /**
     * GET /api/v1/users/me
     * Get current authenticated user's information
     */
    @GetMapping("/users/me")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<UserInfoResponse>> getMyInfo(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        UserInfoResponse result = userService.getMyProfile(userId);
        return ResponseBuilder.success("User info retrieved successfully", result);
    }

    /**
     * PUT /api/v1/users/me
     * Update current authenticated user's information
     */
    @PutMapping("/users/me")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<UserInfoResponse>> updateMyInfo(
            @RequestBody UpdateUserRequest updateUserRequest,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        UserInfoResponse user = userService.updateMyProfile(userId, updateUserRequest);
        return ResponseBuilder.success("User info updated successfully", user);
    }

    /**
     * PUT /api/v1/users/me/image
     * Upload profile image for current user
     */
    @PutMapping("/users/me/image")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<String>> uploadMyImage(
            @RequestParam("file") MultipartFile image,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        String imageUrl = userService.uploadMyAvatar(userId, image);
        return ResponseBuilder.success("User image uploaded successfully", imageUrl);
    }
}