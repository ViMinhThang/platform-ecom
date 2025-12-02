package com.ecom.user.service;

import com.ecom.common.exception.*;
import com.ecom.common.service.FileStorageService;
import com.ecom.user.dtos.*;
import com.ecom.user.entity.*;
import com.ecom.user.repositories.*;
import com.ecom.user.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;

    @Override
    public AuthenticationResult login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "User email", loginRequest.getEmail()));

        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new APIException("Invalid email or password!");
        }

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(String.valueOf(user.getUserId()));
        UserInfoResponse response = mapUserToUserInfoResponse(user);
        return new AuthenticationResult(response, jwtCookie);
    }

    @Override
    public UserInfoResponse validate(String token) {
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "User Id", userId));
        return mapUserToUserInfoResponse(user);
    }

    @Override
    @Transactional
    public void register(SignupRequest signUpRequest) {
        // Tái sử dụng logic check tồn tại
        checkEmailAndUsernameExists(signUpRequest.getEmail(), signUpRequest.getUsername());

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())
        );

        Set<Role> roles = resolveRoles(signUpRequest.getRole());
        user.setRoles(roles);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserInfoResponse updateUserById(UpdateUserRequest request, Long userId) {
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
            // Giả sử userDTO.getRoles() trả về Set<RoleDTO> hoặc Set<Role>
            // Nếu DTO chứa Set<String> tên role thì cần sửa logic map ở đây
            Set<Role> roles = userDTO.getRoles().stream()
                    .map(r -> roleRepository.findByRoleName(r.getRoleName())
                            .orElseThrow(() -> new ResourceNotFoundException("Role", "name", r.getRoleName())))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        checkEmailAndUsernameExists(userDTO.getEmail(), userDTO.getUsername());

        User user = modelMapper.map(userDTO, User.class);

        user.setPassword(encoder.encode("12345678"));

        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "Role Name", "ROLE_USER"));
        user.setRoles(Set.of(userRole));

        userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    @Transactional
    public String uploadUserImage(Long userId, MultipartFile image) {
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

    // Hàm dùng chung cho Register và CreateUser (Check khi tạo mới)
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

    private Set<Role> resolveRoles(Set<String> strRoles) {
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(getRole(AppRole.ROLE_USER));
            return roles;
        }
        strRoles.forEach(role -> {
            switch (role.toLowerCase()) {
                case "admin": roles.add(getRole(AppRole.ROLE_ADMIN)); break;
                case "seller": roles.add(getRole(AppRole.ROLE_SELLER)); break;
                default: roles.add(getRole(AppRole.ROLE_USER));
            }
        });
        return roles;
    }

    private Role getRole(AppRole roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " is not found."));
    }

    @Override
    public UserDTO deleteUser(Long userId) {
        User user = getUserByUserIdFromDatabase(userId);
        userRepository.delete(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserInfoResponse getUserById(String userId) {
        return mapUserToUserInfoResponse(getUserByUserIdFromDatabase(Long.valueOf(userId)));
    }

    @Override
    public RoleResponse getAllRoles() {
        List<RoleDTO> roleDTOList = roleRepository.findAll().stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .toList();
        return new RoleResponse(roleDTOList);
    }

    @Override
    public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> userPage = userRepository.findAll(pageDetails);
        List<UserDTO> userDTOS = userPage.getContent().stream()
                .map(category -> modelMapper.map(category, UserDTO.class)).toList();

        return UserResponse.builder()
                .content(userDTOS)
                .pageNumber(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .lastPage(userPage.isLast())
                .build();
    }
}