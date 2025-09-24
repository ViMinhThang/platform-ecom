package com.ecom.user.controller;

import com.ecom.user.config.AuthContext;
import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.dtos.UserInfoResponse;
import com.ecom.user.entity.User;
import com.ecom.user.exceptions.ResourceNotFoundException;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.security.JwtUtils;
import com.ecom.user.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {


    @Autowired
    AddressService addressService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthContext authContext;

    @PostMapping("")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO,
                                                    HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));

        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO, user);
        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<AddressDTO>> getAddresses() {
        List<AddressDTO> addressList = addressService.getAddresses();
        return new ResponseEntity<>(addressList, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<AddressDTO>> getUserAddresses(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
        List<AddressDTO> addressList = addressService.getUserAddresses(user);
        return new ResponseEntity<>(addressList, HttpStatus.OK);
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Long addressId) {
        AddressDTO addressDTO = addressService.getAddressesById(addressId);
        return new ResponseEntity<>(addressDTO, HttpStatus.OK);
    }


    @PutMapping("/{addressId}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long addressId
            , @RequestBody AddressDTO addressDTO) {
        AddressDTO updatedAddress = addressService.updateAddress(addressId, addressDTO);
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<String> updateAddress(@PathVariable Long addressId) {
        String status = addressService.deleteAddress(addressId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

}
