package com.ecom.user.controller.admin;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.user.dtos.UserDTO;
import com.ecom.user.service.signature.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/internal/user-service")
@RequiredArgsConstructor
@RestController
public class InternalController {
    AdminUserService adminUserService;

    /**
     * GET /api/v1/internal/users/{userId}/email
     * Internal endpoint for other microservices to get user email
     * Should be protected at gateway level (not exposed publicly)
     */
    @GetMapping("/users/{userId}/email")
    public ResponseEntity<APIResponse<String>> getEmailByUserId(@PathVariable Long userId) {
        UserDTO user = adminUserService.getUserById(userId);
        return ResponseBuilder.success("Email retrieved successfully", user.getEmail());
    }

    /**
     * GET /api/v1/internal/users/{userId}
     * Internal endpoint for other microservices to get user details
     * Should be protected at gateway level (not exposed publicly)
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<APIResponse<UserDTO>> getUserByIdInternal(@PathVariable Long userId) {
        UserDTO user = adminUserService.getUserById(userId);
        return ResponseBuilder.success("User retrieved successfully", user);
    }
}
