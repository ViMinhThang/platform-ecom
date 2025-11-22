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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    FileStorageService fileStorageService;

    @Override
    public AuthenticationResult login(LoginRequest loginRequest) {
        System.out.println(loginRequest.toString());
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User", "User email", loginRequest.getEmail()));
        System.out.println(user.toString());
//        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
//            throw new APIException("not valid!!");
//        }

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(String.valueOf(user.getUserId()));

        List<String> roles = user.getRoles().stream().map(role -> role.getRoleName().toString()).toList();


        UserInfoResponse response = new UserInfoResponse(user.getUserId(), user.getImageUrl(), user.getUserName(), user.getEmail(), user.getIsActive(), roles);

        return new AuthenticationResult(response, jwtCookie);
    }

    @Override
    public UserInfoResponse validate(String token) {

        String userId = jwtUtils.getUserIdFromJwtToken(token);

        User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new ResourceNotFoundException("User", "User Id", userId));


        List<String> roles = user.getRoles().stream().map(role -> role.getRoleName().toString()).toList();


        return new UserInfoResponse(user.getUserId(), user.getImageUrl(), user.getUserName(), user.getEmail(), user.getIsActive(), roles);
    }

    @Override
    public UserInfoResponse updateUserById(UpdateUserRequest updateUserRequest, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User service", "UserId", userId));
        if (!encoder.matches(updateUserRequest.getCurrentPassword(), user.getPassword())) {
            throw new APIException("Incorrect Password");
        }
        user.setEmail(updateUserRequest.getEmail());
        user.setUserName(updateUserRequest.getUsername());
        if (!updateUserRequest.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(updateUserRequest.getPassword()));
        }
        User savedUser = userRepository.save(user);
        List<String> roles = savedUser.getRoles().stream().map(role -> role.getRoleName().toString()).toList();
        return new UserInfoResponse(savedUser.getUserId(), savedUser.getUserName(), savedUser.getEmail(), savedUser.getImageUrl(), savedUser.getIsActive(), roles);
    }

    @Override
    public RoleResponse getAllRoles() {
        List<RoleDTO> roleDTOList = roleRepository.findAll().stream().map(role -> modelMapper.map(role, RoleDTO.class)).toList();
        return new RoleResponse(roleDTOList);
    }

    @Override
    public String uploadUserImage(Long userId, MultipartFile image) {

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User service", "UserId", userId));

        if (!user.getImageUrl().isEmpty()) {
            fileStorageService.deleteFile(user.getImageUrl());
        }
        return fileStorageService.storeFile(image);
    }

    @Override
    public UserDTO updateUserByAdmin(Long userId, UserDTO userDTO) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User service", "UserId", userId));
        user.setEmail(userDTO.getEmail());
        user.setImageUrl(userDTO.getImageUrl());
        user.setUserName(userDTO.getUsername());
        user.setRoles(userDTO.getRoles());
        user.setIsActive(userDTO.getIsActive());
        userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "Role Name", "ROLE_USER"));
        user.setRoles(Set.of(userRole));
        userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User service", "UserId", userId));
        userRepository.delete(user);
        return modelMapper.map(user, UserDTO.class);
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
        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "seller":
                        Role modRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Override
    public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> userPage = userRepository.findAll(pageDetails);

        List<UserDTO> userDTOS = userPage.getContent().stream().map(category -> modelMapper.map(category, UserDTO.class)).toList();

        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userDTOS);
        userResponse.setPageNumber(userPage.getNumber());
        userResponse.setPageSize(userPage.getSize());
        userResponse.setTotalElements(userPage.getTotalElements());
        userResponse.setTotalPages(userPage.getTotalPages());
        userResponse.setLastPage(userPage.isLast());

        return userResponse;
    }


    @Override
    public UserInfoResponse getUserById(String userId) {
        User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new ResourceNotFoundException("User", "Userid", userId));

        List<String> roles = user.getRoles().stream().map(role -> role.getRoleName().toString()).toList();

        return new UserInfoResponse(user.getUserId(), user.getUserName(), user.getEmail(), user.getImageUrl(), user.getIsActive(), roles);
    }

}
