package com.ecom.user.service.signature;

import com.ecom.user.dtos.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO getAddressesById(Long addressId);

    List<AddressDTO> getAddresses();

    List<AddressDTO> getUserAddresses(Long userId);
    AddressDTO updateAddress(Long addressId, AddressDTO addressDTO,Long userId);

    String deleteAddress(Long addressId,Long userId);

    AddressDTO createAddress(AddressDTO addressDTO, Long userId);
    AddressDTO getAddressByIdAdmin(Long addressId);

    List<AddressDTO> getAddressesByUserId(Long userId);

    String deleteAddressAdmin(Long addressId);

    AddressDTO getAddressById(Long addressId, Long userId);
}