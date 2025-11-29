package com.ecom.user.service;

import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.entity.Address;
import com.ecom.user.entity.User;
import com.ecom.user.exceptions.ResourceNotFoundException;
import com.ecom.user.repositories.AddressRepository;
import com.ecom.user.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public AddressDTO getAddressesById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddresses() {
        List<Address> addresses = addressRepository.findAll();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .toList();
    }

    @Override
    public List<AddressDTO> getUserAddresses(User user) {
        List<Address> addresses = user.getAddresses();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .toList();
    }

    @Override
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        Address addressFromDatabase = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        addressFromDatabase.setCity(addressDTO.getCity());
        addressFromDatabase.setPincode(addressDTO.getPincode());
        addressFromDatabase.setState(addressDTO.getState());
        addressFromDatabase.setCountry(addressDTO.getCountry());
        addressFromDatabase.setStreet(addressDTO.getStreet());
        addressFromDatabase.setBuildingName(addressDTO.getBuildingName());

        // Update GHN fields
        addressFromDatabase.setProvinceId(addressDTO.getProvinceId());
        addressFromDatabase.setProvinceName(addressDTO.getProvinceName());
        addressFromDatabase.setDistrictId(addressDTO.getDistrictId());
        addressFromDatabase.setDistrictName(addressDTO.getDistrictName());
        addressFromDatabase.setWardCode(addressDTO.getWardCode());
        addressFromDatabase.setWardName(addressDTO.getWardName());

        // Handle default address logic
        if (Boolean.TRUE.equals(addressDTO.getIsDefault())) {
            User user = addressFromDatabase.getUser();
            // Unset all other addresses as default
            user.getAddresses().forEach(addr -> {
                if (!addr.getAddressId().equals(addressId)) {
                    addr.setIsDefault(false);
                }
            });
            addressRepository.saveAll(user.getAddresses());
            addressFromDatabase.setIsDefault(true);
        } else if (addressDTO.getIsDefault() != null) {
            addressFromDatabase.setIsDefault(false);
        }

        Address updatedAddress = addressRepository.save(addressFromDatabase);

        User user = addressFromDatabase.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        user.getAddresses().add(updatedAddress);
        userRepository.save(user);

        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    public String deleteAddress(Long addressId) {
        Address addressFromDatabase = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        User user = addressFromDatabase.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        userRepository.save(user);

        addressRepository.delete(addressFromDatabase);

        return "Address deleted successfully with addressId: " + addressId;
    }

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        // Validate max 5 addresses per user
        if (user.getAddresses().size() >= 5) {
            throw new IllegalStateException("Maximum of 5 addresses allowed per user");
        }

        Address address = modelMapper.map(addressDTO, Address.class);
        address.setUser(user);

        // Handle default address logic
        if (Boolean.TRUE.equals(addressDTO.getIsDefault())) {
            // Unset all other addresses as default
            user.getAddresses().forEach(addr -> addr.setIsDefault(false));
            addressRepository.saveAll(user.getAddresses());
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }

        List<Address> addressesList = user.getAddresses();
        addressesList.add(address);
        user.setAddresses(addressesList);
        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }
}
