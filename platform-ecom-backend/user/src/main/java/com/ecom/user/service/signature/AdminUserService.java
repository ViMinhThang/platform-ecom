package com.ecom.user.service.signature;

import com.ecom.user.dtos.UserDTO;
import com.ecom.user.dtos.response.UserResponse;

import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    public UserResponse getAllUsers(Pageable pageable);

    public UserDTO createUserByAdmin(UserDTO userDTO);

    public UserDTO updateUserByAdmin(Long userId, UserDTO userDTO);

    public void deleteUser(Long userId);

    public UserDTO getUserById(Long userId);

    public UserDTO getUserByEmail(String email);

    public String uploadUserImage(Long userId, org.springframework.web.multipart.MultipartFile image);
}
