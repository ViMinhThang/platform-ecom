package com.ecom.user.controller.admin;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.dtos.UserDTO;
import com.ecom.user.service.signature.AddressService;
import com.ecom.user.service.signature.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/internal/user-service")
@RequiredArgsConstructor
@RestController
public class InternalController {
    private final AdminUserService adminUserService;
    private final AddressService addressService;

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

    @GetMapping("addresses/{addressId}")
    public ResponseEntity<APIResponse<AddressDTO>> getAddressById(@PathVariable Long addressId) {
        AddressDTO addressDTO = addressService.getAddressByIdAdmin(addressId);
        return ResponseBuilder.success("Address retrieved successfully", addressDTO);
    }
}
