package com.ecom.user.controller.admin;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.user.dtos.*;
import com.ecom.user.service.signature.AdminUserService;
import com.ecom.user.service.signature.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for admin-level user management
 * All endpoints require ROLE_ADMIN
 * Base path: /api/v1
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
    @GetMapping()
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserResponse>> getAllUsers(PaginationRequest paginationRequest) {
        String sortBy = "id".equals(paginationRequest.getSortBy())
                ? "userId"
                : paginationRequest.getSortBy();

        Sort sort = paginationRequest.getSortOrder().equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(paginationRequest.getPageNumber(), paginationRequest.getPageSize(), sort);

        UserResponse userResponse = adminUserService.getAllUsers(pageable);
        return ResponseBuilder.success("Users retrieved successfully", userResponse);
    }

    /**
     * GET /api/v1/admin/users/{id}
     * Admin endpoint to get specific user by ID
     */
    @GetMapping("/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserDTO>> getUserById(@PathVariable("id") Long userId) {
        UserDTO result = adminUserService.getUserById(userId);
        return ResponseBuilder.success("User info retrieved successfully", result);
    }

    /**
     * POST /api/v1/admin/users
     * Admin endpoint to create new user
     */
    @PostMapping()
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO savedUser = adminUserService.createUserByAdmin(userDTO);
        return ResponseBuilder.createdWithMessage("User created successfully", savedUser);
    }

    /**
     * PUT /api/v1/admin/users/{id}
     * Admin endpoint to update any user
     */
    @PutMapping("/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserDTO>> updateUserByAdmin(
            @PathVariable("id") Long userId,
            @Valid @RequestBody UserDTO userDTO) {
        UserDTO savedUser = adminUserService.updateUserByAdmin(userId, userDTO);
        return ResponseBuilder.success("User updated successfully", savedUser);
    }

    /**
     * PUT /api/v1/admin/users/{id}/image
     * Admin endpoint to update user image
     */
    @PutMapping("/{id}/image")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<String>> uploadUserImage(
            @PathVariable("id") Long userId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile image) {
        String imageUrl = adminUserService.uploadUserImage(userId, image);
        return ResponseBuilder.success("User image updated successfully", imageUrl);
    }

    /**
     * DELETE /api/v1/admin/users/{id}
     * Admin endpoint to delete user
     */
    @DeleteMapping("/{id}")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<UserDTO>> deleteUserById(@PathVariable("id") Long userId) {
        adminUserService.deleteUser(userId);
        return ResponseBuilder.success("User deleted successfully", null);
    }

    /**
     * GET /api/v1/admin/roles
     * Admin endpoint to get all roles
     */
    @GetMapping("/roles")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<RoleResponse>> getAllRoles() {
        RoleResponse roleResponse = roleService.getAllRoles();
        return ResponseBuilder.success("Roles retrieved successfully", roleResponse);
    }

}