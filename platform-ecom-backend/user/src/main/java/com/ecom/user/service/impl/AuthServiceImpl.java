package com.ecom.user.service.impl;

import com.ecom.common.exception.*;
import com.ecom.user.dtos.*;
import com.ecom.user.dtos.request.LoginRequest;
import com.ecom.user.dtos.request.SignupRequest;
import com.ecom.user.dtos.response.UserInfoResponse;
import com.ecom.user.entity.Role;
import com.ecom.user.entity.User;
import com.ecom.user.mapper.UserMapper;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.security.JwtUtils;
import com.ecom.user.service.signature.AuthService;
import com.ecom.user.service.signature.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final RoleService roleService;
    private final UserMapper userMapper;

    @Override
    public AuthenticationResult login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "User email", loginRequest.getEmail()));

        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for email: {}", loginRequest.getEmail());
            throw new APIException("Invalid email or password!");
        }

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(String.valueOf(user.getUserId()));
        UserInfoResponse response = userMapper.toUserInfoResponse(user);
        return new AuthenticationResult(response, jwtCookie);
    }

    @Override
    public UserInfoResponse validate(String token) {
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "User Id", userId));
        return userMapper.toUserInfoResponse(user);
    }

    @Override
    @Transactional
    public void register(SignupRequest signUpRequest) {
        checkEmailAndUsernameExists(signUpRequest.getEmail(), signUpRequest.getUsername());

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = roleService.resolveRoles(signUpRequest.getRole());
        user.setRoles(roles);

        userRepository.save(user);
    }

    private void checkEmailAndUsernameExists(String email, String username) {
        if (userRepository.existsByUserName(username)) {
            throw new UserAlreadyExistsException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Error: Email is already in use");
        }
    }

}