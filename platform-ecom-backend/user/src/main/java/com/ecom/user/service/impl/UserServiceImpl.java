package com.ecom.user.service.impl;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import com.ecom.common.service.FileStorageService;
import com.ecom.user.dtos.request.UpdateUserRequest;
import com.ecom.user.dtos.response.UserInfoResponse;
import com.ecom.user.entity.User;
import com.ecom.user.mapper.UserMapper;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.service.signature.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final FileStorageService fileStorageService;
    private final UserMapper userMapper;

    @Override
    public UserInfoResponse getMyProfile(Long userId) {
        User user = getUserByUserIdFromDatabase(userId);
        return userMapper.toUserInfoResponse(user);
    }

    @Override
    @Transactional
    public UserInfoResponse updateMyProfile(Long userId, UpdateUserRequest request) {
        User user = getUserByUserIdFromDatabase(userId);

        // Verify current password
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không chính xác");
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
        return userMapper.toUserInfoResponse(savedUser);
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

}
