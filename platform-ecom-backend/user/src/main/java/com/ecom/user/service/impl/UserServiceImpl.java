package com.ecom.user.service;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.common.service.FileStorageService;
import com.ecom.user.dtos.UpdateUserRequest;
import com.ecom.user.dtos.UserInfoResponse;
import com.ecom.user.entity.User;
import com.ecom.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final FileStorageService fileStorageService;

    @Override
    public UserInfoResponse getMyProfile(Long userId) {
        User user = getUserByUserIdFromDatabase(userId);
        return mapUserToUserInfoResponse(user);
    }

    @Override
    @Transactional
    public UserInfoResponse updateMyProfile(Long userId, UpdateUserRequest request) {
        User user = getUserByUserIdFromDatabase(userId);

        // Check password cũ
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new APIException("Incorrect Password");
        }

        // Validate unique data (Email/Username)
        validateUniqueData(user.getUserId(), request.getEmail(), request.getUsername());

        // Update Info
        user.setEmail(request.getEmail());
        user.setUserName(request.getUsername());

        // Update Password
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(encoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return mapUserToUserInfoResponse(savedUser);
    }

    @Override
    @Transactional
    public String uploadMyAvatar(Long userId, MultipartFile image) {
        User user = getUserByUserIdFromDatabase(userId);

        if (user.getImageUrl() != null && !user.getImageUrl().isEmpty()) {
            fileStorageService.deleteFile(user.getImageUrl());
        }

        String fileName = fileStorageService.storeFile(image);

        user.setImageUrl(fileName);
        userRepository.save(user);

        return fileName;
    }

    private User getUserByUserIdFromDatabase(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
    }

    private void validateUniqueData(Long currentUserId, String newEmail, String newUsername) {
        User currentUser = getUserByUserIdFromDatabase(currentUserId);

        if (!currentUser.getUserName().equals(newUsername) && userRepository.existsByUserName(newUsername)) {
            throw new APIException("Username is already taken!");
        }

        if (!currentUser.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new APIException("Email is already in use!");
        }
    }

    private UserInfoResponse mapUserToUserInfoResponse(User user) {
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
