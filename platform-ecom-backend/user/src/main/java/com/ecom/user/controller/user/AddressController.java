package com.ecom.user.controller.user;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.service.signature.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;
    private final AuthContext authContext;


    /**
     * POST /api/v1/users/addresses
     * Create a new address for the authenticated user
     * */
    @PostMapping()
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<AddressDTO>> createAddress(@Valid @RequestBody AddressDTO addressDTO,
                                                                 HttpServletRequest request) {
        Long userId = authContext.getUserId(request);


        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO, userId);
        return ResponseBuilder.createdWithMessage("Address created successfully", savedAddressDTO);
    }


    /**
     * GET /api/v1/users/addresses
     * Get all addresses for the authenticated user
     */
    @GetMapping("/user")
    public ResponseEntity<APIResponse<List<AddressDTO>>> getMyAddresses(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        List<AddressDTO> addressList = addressService.getUserAddresses(userId);
        return ResponseBuilder.success("User addresses retrieved successfully", addressList);
    }

    /**
     * GET /api/v1/users/addresses/{addressId}
     * Get a specific address by ID (only if it belongs to the authenticated user)
     */
    @GetMapping("/{addressId}")
    public ResponseEntity<APIResponse<AddressDTO>> getAddressById(
            @PathVariable Long addressId,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        AddressDTO addressDTO = addressService.getAddressById(addressId, userId);
        return ResponseBuilder.success("Address retrieved successfully", addressDTO);
    }

    /**
     * PUT /api/v1/users/addresses/{addressId}
     * Update an existing address (only if it belongs to the authenticated user)
     */
    @PutMapping("/{addressId}")
    public ResponseEntity<APIResponse<AddressDTO>> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressDTO addressDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        // Update and verify ownership
        AddressDTO updatedAddress = addressService.updateAddress(addressId, addressDTO, userId);
        return ResponseBuilder.success("Address updated successfully", updatedAddress);
    }

    /**
     * DELETE /api/v1/users/addresses/{addressId}
     * Delete an address (only if it belongs to the authenticated user)
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<APIResponse<String>> deleteAddress(
            @PathVariable Long addressId,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        String status = addressService.deleteAddress(addressId, userId);
        return ResponseBuilder.success("Address deleted successfully", status);
    }

}