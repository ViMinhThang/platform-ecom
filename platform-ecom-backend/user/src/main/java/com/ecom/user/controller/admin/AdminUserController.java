package com.ecom.user.controller.admin;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.user.dtos.*;
import com.ecom.user.service.signature.AdminUserService;
import com.ecom.user.service.signature.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for admin-level address management
 * All endpoints require ROLE_ADMIN
 * Base path: /api/v1/admin/addresses
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final RoleService roleService;

    /**
     * GET /api/v1/admin/users
     * Admin endpoint to get all users with pagination
     */
    @GetMapping("/admin/users")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserResponse>> getAllUsers(PaginationRequest paginationRequest) {
        Sort sort = paginationRequest.getSortOrder().equalsIgnoreCase("asc")
                ? Sort.by(paginationRequest.getSortBy()).ascending()
                : Sort.by(paginationRequest.getSortBy()).descending();
        Pageable pageable = PageRequest.of(paginationRequest.getPageNumber(), paginationRequest.getPageSize(), sort);

        UserResponse userResponse = adminUserService.getAllUsers(pageable);
        return ResponseBuilder.success("Users retrieved successfully", userResponse);
    }

    /**
     * GET /api/v1/admin/users/{id}
     * Admin endpoint to get specific user by ID
     */
    @GetMapping("/admin/users/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserInfoResponse>> getUserById(@PathVariable("id") Long userId) {
        UserInfoResponse result = adminUserService.getUserById(userId);
        return ResponseBuilder.success("User info retrieved successfully", result);
    }

    /**
     * POST /api/v1/admin/users
     * Admin endpoint to create new user
     */
    @PostMapping("/admin/users")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserDTO>> createUser(@RequestBody UserDTO userDTO) {
        UserDTO savedUser = adminUserService.createUserByAdmin(userDTO);
        return ResponseBuilder.createdWithMessage("User created successfully", savedUser);
    }

    /**
     * PUT /api/v1/admin/users/{id}
     * Admin endpoint to update any user
     */
    @PutMapping("/admin/users/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserDTO>> updateUserByAdmin(
            @PathVariable("id") Long userId,
            @RequestBody UserDTO userDTO) {
        UserDTO savedUser = adminUserService.updateUserByAdmin(userId, userDTO);
        return ResponseBuilder.success("User updated successfully", savedUser);
    }

    /**
     * DELETE /api/v1/admin/users/{id}
     * Admin endpoint to delete user
     */
    @DeleteMapping("/admin/users/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserDTO>> deleteUserById(@PathVariable("id") Long userId) {
        adminUserService.deleteUser(userId);
        return ResponseBuilder.success("User deleted successfully", null);
    }

    /**
     * GET /api/v1/admin/roles
     * Admin endpoint to get all roles
     */
    @GetMapping("/admin/roles")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<RoleResponse>> getAllRoles() {
        RoleResponse roleResponse = roleService.getAllRoles();
        return ResponseBuilder.success("Roles retrieved successfully", roleResponse);
    }

    /**
     * GET /api/v1/internal/users/{userId}/email
     * Internal endpoint for other microservices to get user email
     * Should be protected at gateway level (not exposed publicly)
     */
    @GetMapping("/internal/users/{userId}/email")
    public ResponseEntity<APIResponse<String>> getEmailByUserId(@PathVariable Long userId) {
        UserInfoResponse user = adminUserService.getUserById(userId);
        return ResponseBuilder.success("Email retrieved successfully", user.getEmail());
    }
}