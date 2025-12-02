package com.ecom.user.service;

import com.ecom.user.dtos.UserDTO;
import com.ecom.user.dtos.UserInfoResponse;
import com.ecom.user.dtos.UserResponse;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    public UserResponse getAllUsers(Pageable pageable);

    public UserDTO createUserByAdmin(UserDTO userDTO);

    public UserDTO updateUserByAdmin(Long userId, UserDTO userDTO);

    public void deleteUser(Long userId);

    public UserInfoResponse getUserById(Long userId);
}
