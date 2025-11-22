package com.ecom.user.service;

import com.ecom.user.dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {
    ResponseEntity<MessageResponse> register(@Valid SignupRequest signUpRequest);

    UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserInfoResponse getUserById(String userId);

    AuthenticationResult login(LoginRequest loginRequest);

    UserInfoResponse validate(String token);

    UserInfoResponse updateUserById(UpdateUserRequest updateUserRequest, Long userId);

    RoleResponse getAllRoles();

    String uploadUserImage(Long userId, MultipartFile image);

    UserDTO updateUserByAdmin(Long userId, UserDTO userDTO);

    UserDTO createUser(UserDTO userDTO);

    UserDTO deleteUser(Long userId);
}
