package com.ecom.user.service.impl;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.common.exception.UserAlreadyExistsException;
import com.ecom.common.service.FileStorageService;
import com.ecom.user.dtos.UserDTO;
import com.ecom.user.dtos.UserResponse;
import com.ecom.user.entity.AppRole;
import com.ecom.user.entity.Role;
import com.ecom.user.entity.User;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.service.signature.AdminUserService;
import com.ecom.user.service.signature.RoleService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder encoder;
    private final RoleService roleService;
    private final FileStorageService fileStorageService;

    @Override
    public UserResponse getAllUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);
        List<UserDTO> userDTOS = userPage.getContent().stream()
                .map(user -> modelMapper.map(user, UserDTO.class)).toList();

        return UserResponse.builder()
                .content(userDTOS)
                .pageNumber(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .lastPage(userPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public UserDTO createUserByAdmin(UserDTO userDTO) {
        checkEmailAndUsernameExists(userDTO.getEmail(), userDTO.getUsername());

        User user = modelMapper.map(userDTO, User.class);

        user.setPassword(encoder.encode("12345678"));

        // Default role if not provided or handle roles from DTO
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            Set<Role> roles = userDTO.getRoles().stream()
                    .map(r -> roleService.getRole(r.getRoleName()))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        } else {
            Role userRole = roleService.getRole(AppRole.ROLE_USER);
            user.setRoles(Set.of(userRole));
        }

        userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    @Transactional
    public UserDTO updateUserByAdmin(Long userId, UserDTO userDTO) {
        User user = getUserByUserIdFromDatabase(userId);

        // Validate unique data
        validateUniqueData(user.getUserId(), userDTO.getEmail(), userDTO.getUsername());

        // Update fields
        user.setEmail(userDTO.getEmail());
        user.setUserName(userDTO.getUsername());
        user.setIsActive(userDTO.getIsActive());

        if (userDTO.getImageUrl() != null) {
            user.setImageUrl(userDTO.getImageUrl());
        }

        // Update Roles
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            Set<Role> roles = userDTO.getRoles().stream()
                    .map(r -> roleService.getRole(r.getRoleName()))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserByUserIdFromDatabase(userId);
        userRepository.delete(user);
    }

    @Override
    public UserDTO getUserById(Long userId) {
        return modelMapper.map(getUserByUserIdFromDatabase(userId), UserDTO.class);
    }

    @Override
    @Transactional
    public String uploadUserImage(Long userId, org.springframework.web.multipart.MultipartFile image) {
        User user = getUserByUserIdFromDatabase(userId);

        // Delete old image if it exists and is not the default image
        String oldImageUrl = user.getImageUrl();
        if (oldImageUrl != null && !oldImageUrl.isEmpty() && !"31343C.svg".equals(oldImageUrl)) {
            try {
                fileStorageService.deleteFile(oldImageUrl);
            } catch (Exception e) {
                // Log but don't fail if old image deletion fails
                // The new image upload should still proceed
            }
        }

        // Store new image
        String fileName = fileStorageService.storeFile(image);
        user.setImageUrl(fileName);
        userRepository.save(user);
        return fileName;
    }

    private User getUserByUserIdFromDatabase(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
    }

    private void checkEmailAndUsernameExists(String email, String username) {
        if (userRepository.existsByUserName(username)) {
            throw new UserAlreadyExistsException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Error: Email is already in use");
        }
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
