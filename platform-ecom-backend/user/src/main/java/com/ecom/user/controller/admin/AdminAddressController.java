package com.ecom.user.controller.admin;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.service.signature.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for admin-level address management
 * All endpoints require ROLE_ADMIN
 * Base path: /api/v1/admin/addresses
 */
@RestController
@RequestMapping("/api/v1/admin/addresses")
@RequiredArgsConstructor
public class AdminAddressController {

    private final AddressService addressService;

    /**
     * GET /api/v1/admin/addresses
     * Get all addresses in the system (admin view)
     */
    @GetMapping
    public ResponseEntity<APIResponse<List<AddressDTO>>> getAllAddresses() {
        List<AddressDTO> addressList = addressService.getAddresses();
        return ResponseBuilder.success("All addresses retrieved successfully", addressList);
    }

    /**
     * GET /api/v1/admin/addresses/{addressId}
     * Get any address by ID (admin can view any address)
     */
    @GetMapping("/{addressId}")
    public ResponseEntity<APIResponse<AddressDTO>> getAddressById(@PathVariable Long addressId) {
        AddressDTO addressDTO = addressService.getAddressByIdAdmin(addressId);
        return ResponseBuilder.success("Address retrieved successfully", addressDTO);
    }

    /**
     * GET /api/v1/admin/users/{userId}/addresses
     * Get all addresses for a specific user (admin view)
     */
    @GetMapping("/users/{userId}/addresses")
    public ResponseEntity<APIResponse<List<AddressDTO>>> getUserAddresses(@PathVariable Long userId) {
        List<AddressDTO> addressList = addressService.getAddressesByUserId(userId);
        return ResponseBuilder.success("User addresses retrieved successfully", addressList);
    }

    /**
     * DELETE /api/v1/admin/addresses/{addressId}
     * Delete any address (admin action)
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<APIResponse<String>> deleteAddress(@PathVariable Long addressId) {
        String status = addressService.deleteAddressAdmin(addressId);
        return ResponseBuilder.success("Address deleted successfully", status);
    }
}