package com.ecom.user.service.impl;

import com.ecom.common.exception.UnauthorizedException;
import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.entity.Address;
import com.ecom.user.entity.User;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.user.repositories.AddressRepository;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.service.signature.AddressService;
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
    public List<AddressDTO> getUserAddresses(Long userId) {
        return addressRepository.findByUserUserId(userId).stream()
                .map(address -> modelMapper.map(address,AddressDTO.class))
                .toList();
    }
    @Override
    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        long count = addressRepository.countByUserUserId(userId); // Tối ưu dùng countByUserId
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
    public AddressDTO getAddressByIdAdmin(Long addressId) {
        Address address = getAddressFromDatabase(addressId);
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddressesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        return user.getAddresses().stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .toList();
    }

    @Override
    @Transactional
    public String deleteAddressAdmin(Long addressId) {
        Address address = getAddressFromDatabase(addressId);

        addressRepository.delete(address);
        return "Address deleted successfully with addressId: " + addressId;
    }


    @Override
    public AddressDTO getAddressById(Long addressId, Long userId) {
        Address address = getAddressFromDatabase(addressId);

        if (!address.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not allowed to access this address");
        }

        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO, Long userId) {
        Address address = getAddressFromDatabase(addressId);

        if (!address.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not allowed to modify this address");
        }

        modelMapper.map(addressDTO, address);

        handleDefaultAddressLogic(address, addressDTO.getIsDefault());

        Address updatedAddress = addressRepository.save(address);
        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    @Transactional
    public String deleteAddress(Long addressId, Long userId) {
        Address address = getAddressFromDatabase(addressId);

        if (!address.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not allowed to delete this address");
        }

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