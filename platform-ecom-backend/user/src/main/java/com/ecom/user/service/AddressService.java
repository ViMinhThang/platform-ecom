package com.ecom.user.service;

import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.entity.User;
import jakarta.validation.Valid;

import java.util.List;

public interface AddressService {
    AddressDTO getAddressesById(Long addressId);

    List<AddressDTO> getAddresses();

    List<AddressDTO> getUserAddresses(User user);

    AddressDTO updateAddress(Long addressId, AddressDTO addressDTO);

    String deleteAddress(Long addressId);

    AddressDTO createAddress(@Valid AddressDTO addressDTO, User user);
}
