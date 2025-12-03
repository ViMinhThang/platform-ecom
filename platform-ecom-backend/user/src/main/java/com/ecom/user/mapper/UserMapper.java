package com.ecom.user.mapper;

import com.ecom.user.dtos.UserInfoResponse;
import com.ecom.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

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

        return UserInfoResponse.builder()
                .userId(user.getUserId())
                .username(user.getUserName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .isActive(user.getIsActive())
                .roles(roles)
                .build();
    }
}
