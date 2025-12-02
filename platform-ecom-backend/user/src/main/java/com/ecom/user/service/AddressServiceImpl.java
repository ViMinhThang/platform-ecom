package com.ecom.user.service;

import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.entity.Address;
import com.ecom.user.entity.User;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.user.repositories.AddressRepository;
import com.ecom.user.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final ModelMapper modelMapper;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public AddressDTO getAddressesById(Long addressId) {
        Address address = getAddressFromDatabase(addressId);
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddresses() {
        return addressRepository.findAll().stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .toList();
    }

    @Override
    public List<AddressDTO> getUserAddresses(User user) {
        return user.getAddresses().stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .toList();
    }

    @Override
    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        long count = addressRepository.countByUser(user);
        if (count >= 5) {
            throw new IllegalStateException("Maximum of 5 addresses allowed per user");
        }

        Address address = modelMapper.map(addressDTO, Address.class);
        address.setUser(user);

        handleDefaultAddressLogic(address, addressDTO.getIsDefault());

        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        Address address = getAddressFromDatabase(addressId);

        modelMapper.map(addressDTO, address);

        handleDefaultAddressLogic(address, addressDTO.getIsDefault());

        Address updatedAddress = addressRepository.save(address);
        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    @Transactional
    public String deleteAddress(Long addressId) {
        Address address = getAddressFromDatabase(addressId);

        addressRepository.delete(address);

        return "Address deleted successfully with addressId: " + addressId;
    }


    private Address getAddressFromDatabase(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
    }

    private void handleDefaultAddressLogic(Address address, Boolean isDefault) {
        if (Boolean.TRUE.equals(isDefault)) {
            addressRepository.resetDefaultAddresses(address.getUser().getUserId());
            address.setIsDefault(true);
        } else if (isDefault != null) {
            address.setIsDefault(false);
        }
    }
}