package com.ecom.user.service;

import com.ecom.user.dtos.*;
import com.ecom.user.entity.AppRole;
import com.ecom.user.entity.Role;
import com.ecom.user.entity.User;
import com.ecom.user.exceptions.APIException;
import com.ecom.user.exceptions.ResourceNotFoundException;
import com.ecom.user.repositories.RoleRepository;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.security.JwtUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public AuthenticationResult login(LoginRequest loginRequest) {

        User user = userRepository.findByUserName(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "User name", loginRequest.getUsername()));

        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new APIException("not valid!!");
        }

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(String.valueOf(user.getUserId()));

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().toString()).toList();

        UserInfoResponse response = new UserInfoResponse(user.getUserId(),
                user.getUserName(), user.getEmail(), roles);

        return new AuthenticationResult(response, jwtCookie);
    }

    @Override
    public UserInfoResponse validate(String token) {

        String userId = jwtUtils.getUserIdFromJwtToken(token);

        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "User Id", userId));


        List<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().toString()).toList();

        UserInfoResponse response = new UserInfoResponse(user.getUserId(),
                user.getUserName(), user.getEmail(), roles);


        return response;
    }

    @Override
    public UserInfoResponse updateUserById(UpdateUserRequest updateUserRequest,Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User service", "UserId",userId));
        if (!encoder.matches(updateUserRequest.getCurrentPassword(), user.getPassword())) {
            throw new APIException("Incorrect Password");
        }
        user.setEmail(updateUserRequest.getEmail());
        user.setUserName(updateUserRequest.getUsername());
        if (!updateUserRequest.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(updateUserRequest.getPassword()));
        }
        User savedUser = userRepository.save(user);
        List<String> roles = savedUser.getRoles().stream()
                .map(role -> role.getRoleName().toString()).toList();
        UserInfoResponse userInfoResponse = new UserInfoResponse(savedUser.getUserId(), savedUser.getUserName(), savedUser.getEmail(), roles);
        return userInfoResponse;
    }

    @Override
    public ResponseEntity<MessageResponse> register(SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "seller":
                        Role modRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Override
    public UserResponse getAllSellers(Pageable pageable) {
        Page<User> allUsers = userRepository.findByRoleName(AppRole.ROLE_SELLER, pageable);
        List<UserDTO> userDtos = allUsers.getContent()
                .stream()
                .map(p -> modelMapper.map(p, UserDTO.class))
                .toList();

        UserResponse response = new UserResponse();
        response.setContent(userDtos);
        response.setPageNumber(allUsers.getNumber());
        response.setPageSize(allUsers.getSize());
        response.setTotalElements(allUsers.getTotalElements());
        response.setTotalPages(allUsers.getTotalPages());
        response.setLastPage(allUsers.isLast());
        return response;
    }

    @Override
    public UserInfoResponse getUserById(String userId) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "Userid", userId));

        List<String> roles = user.getRoles().stream().map(role -> role.getRoleName().toString()).toList();

        UserInfoResponse response = new UserInfoResponse(user.getUserId(),
                user.getUserName(), user.getEmail(), roles);
        return response;
    }

}
