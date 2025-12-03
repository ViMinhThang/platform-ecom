package com.ecom.user.mapper;

import com.ecom.user.dtos.AddressDTO;
import com.ecom.user.dtos.UserInfoResponse;
import com.ecom.user.entity.Address;
import com.ecom.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for converting User entities to DTOs.
 * Centralizes mapping logic to avoid duplication across service classes.
 */
@Component
public class UserMapper {

    /**
     * Convert User entity to UserInfoResponse DTO
     *
     * @param user User entity to convert
     * @return UserInfoResponse DTO with user information
     */
    public UserInfoResponse toUserInfoResponse(User user) {
        if (user == null) {
            return null;
        }

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().toString())
                .toList();

        List<AddressDTO> addresses = user.getAddresses() != null
                ? user.getAddresses().stream()
                        .map(this::toAddressDTO)
                        .collect(Collectors.toList())
                : List.of();

        return UserInfoResponse.builder()
                .userId(user.getUserId())
                .username(user.getUserName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .isActive(user.getIsActive())
                .roles(roles)
                .addresses(addresses)
                .build();
   }

    /**
     * Convert Address entity to AddressDTO
     *
     * @param address Address entity to convert
     * @return AddressDTO with address information
     */
    private AddressDTO toAddressDTO(Address address) {
        if (address == null) {
            return null;
        }

        AddressDTO dto = new AddressDTO();
        dto.setAddressId(address.getAddressId());
        dto.setStreet(address.getStreet());
        dto.setBuildingName(address.getBuildingName());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setCountry(address.getCountry());
        dto.setPincode(address.getPincode());
        dto.setProvinceId(address.getProvinceId());
        dto.setProvinceName(address.getProvinceName());
        dto.setDistrictId(address.getDistrictId());
        dto.setDistrictName(address.getDistrictName());
        dto.setWardCode(address.getWardCode());
        dto.setWardName(address.getWardName());
        dto.setIsDefault(address.getIsDefault());

        return dto;
    }
}
