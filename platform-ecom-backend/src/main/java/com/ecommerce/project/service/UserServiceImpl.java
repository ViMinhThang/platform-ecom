package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Address;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.*;
import com.ecommerce.project.repositories.RoleRepository;
import com.ecommerce.project.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> pageUsers = userRepository.findAll(pageDetails);

        List<User> users = pageUsers.getContent();
        System.out.println(users);
        List<UserDTO> userDTOS = users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();

        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userDTOS);
        userResponse.setPageNumber(pageUsers.getNumber());
        userResponse.setPageSize(pageUsers.getSize());
        userResponse.setTotalElements(pageUsers.getTotalElements());
        userResponse.setTotalPages(pageUsers.getTotalPages());
        userResponse.setLastPage(pageUsers.isLast());
        return userResponse;
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public UserDTO addUser(UserDTO userDTO) {
        User user = new User();
        user.setUserName(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setIsAvailable(userDTO.getIsAvailable());

        Set<Role> attachedRoles = userDTO.getRoles().stream()
                .map(role -> roleRepository.findByRoleName(role.getRoleName())
                        .orElseThrow(() -> new RuntimeException("Role not found: " + role.getRoleName())))
                .collect(Collectors.toSet());

        user.setRoles(attachedRoles);

        User saved = userRepository.save(user);
        return modelMapper.map(saved, UserDTO.class);
    }

    @Override
    public UserDTO getUserById(Long userId) {
        User userFromdb = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));

        UserDTO userDTO = modelMapper.map(userFromdb, UserDTO.class);
        userDTO.setPassword("");
        return userDTO;
    }

    @Override
    public UserDTO updateUserById(Long userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));

        // Xóa hết address cũ
        user.getAddresses().clear();

        // Thêm mới từ DTO
        for (AddressDTO addDTO : userDTO.getAddresses()) {
            Address address = modelMapper.map(addDTO, Address.class);
            address.setUser(user); // ✅ set user
            user.getAddresses().add(address);
        }

        // Cập nhật thông tin user
        user.setUserName(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setIsAvailable(userDTO.getIsAvailable());
        user.setRoles(new HashSet<>(userDTO.getRoles()));

        // Lưu user
        user = userRepository.save(user);

        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public String deleteUserById(Long userId) {
        userRepository.deleteById(userId);
        return "success";
    }


//
//    @Override
//    public UserDTO updateUser(Long userId, UserDTO userDTO) {
//        User userFromDb = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
//        userFromDb.setUserName(userDTO.getUsername());
//        userFromDb.setAddresses(userDTO.get());
//        userFromDb.setUserName(userDTO.getUsername());
//        userFromDb.setUserName(userDTO.getUsername());
//
//
//    }

}
