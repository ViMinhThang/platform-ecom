package com.ecommerce.project.service;

import com.ecommerce.project.model.Role;
import com.ecommerce.project.payload.UserDTO;
import com.ecommerce.project.payload.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    List<Role> getAllRoles();

    UserDTO addUser(UserDTO userDTO);

    UserDTO getUserById(Long userId);

    UserDTO updateUserById(Long userId, UserDTO userDTO);

    String deleteUserById(Long userId);

//    UserDTO updateUser(Long userId, UserDTO userDTO);
}
