package com.ecom.user.controller;

import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.entity.User;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;
    private final AuthContext authContext;

    @PostMapping("")
    public ResponseEntity<APIResponse<AddressDTO>> createAddress(@Valid @RequestBody AddressDTO addressDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));

        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO, user);
        return ResponseBuilder.createdWithMessage("Address created successfully", savedAddressDTO);
    }

    @GetMapping("")
    public ResponseEntity<APIResponse<List<AddressDTO>>> getAddresses() {
        List<AddressDTO> addressList = addressService.getAddresses();
        return ResponseBuilder.success("Addresses retrieved successfully", addressList);
    }

    @GetMapping("/user")
    public ResponseEntity<APIResponse<List<AddressDTO>>> getUserAddresses(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
        List<AddressDTO> addressList = addressService.getUserAddresses(user);
        return ResponseBuilder.success("User addresses retrieved successfully", addressList);
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<APIResponse<AddressDTO>> getAddressById(@PathVariable Long addressId) {
        AddressDTO addressDTO = addressService.getAddressesById(addressId);
        return ResponseBuilder.success("Address retrieved successfully", addressDTO);
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<APIResponse<AddressDTO>> updateAddress(@PathVariable Long addressId,
            @RequestBody AddressDTO addressDTO) {
        AddressDTO updatedAddress = addressService.updateAddress(addressId, addressDTO);
        return ResponseBuilder.success("Address updated successfully", updatedAddress);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<APIResponse<String>> deleteAddress(@PathVariable Long addressId) {
        String status = addressService.deleteAddress(addressId);
        return ResponseBuilder.success("Address deleted successfully", status);
    }

}
