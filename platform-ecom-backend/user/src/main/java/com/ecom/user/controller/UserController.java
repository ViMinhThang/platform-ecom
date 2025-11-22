package com.ecom.user.controller;

import com.ecom.user.aspect.RequireRole;
import com.ecom.user.config.AppConstants;
import com.ecom.user.config.AuthContext;
import com.ecom.user.dtos.*;
import com.ecom.user.entity.AppRole;
import com.ecom.user.entity.User;
import com.ecom.user.repositories.RoleRepository;
import com.ecom.user.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class UserController {


    @Autowired
    AuthService authService;

    @Autowired
    AuthContext authContext;


    @GetMapping
//    @RequireRole("ROLE_SELLER")
    public ResponseEntity<UserResponse> getAllUsers(@RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber, @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize, @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USER_BY, required = false) String sortBy, @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        UserResponse userResponse = authService.getAllUsers(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO savedUser = authService.createUser(userDTO);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResult> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthenticationResult result = authService.login(loginRequest);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, result.getJwtCookie().toString()).body(result);
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.register(signUpRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserInfoResponse> getUserInfo(@PathVariable("id") String userId) {
        UserInfoResponse result = authService.getUserById(userId);
        return new ResponseEntity<UserInfoResponse>(result, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUserByAdmin(@PathVariable("id") Long userId, @RequestBody UserDTO userDTO) {
        UserDTO savedUser = authService.updateUserByAdmin(userId, userDTO);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserDTO> deleteUserById(@PathVariable("id") Long userId) {
        UserDTO deletedUser = authService.deleteUser(userId);
        return new ResponseEntity<>(deletedUser, HttpStatus.OK);
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<String> uploadUserImage(@PathVariable("id") Long userId, @RequestParam("file") MultipartFile image) {
        String imageUrl = authService.uploadUserImage(userId, image);
        return new ResponseEntity<>(imageUrl, HttpStatus.OK);
    }

    @GetMapping("/validate")
    public ResponseEntity<UserInfoResponse> validateToken(@CookieValue("ecom") String jwtToken) {
        UserInfoResponse response = authService.validate(jwtToken);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/get-email-by-user-id/{userId}")
    public ResponseEntity<String> getEmailByUserId(@PathVariable Long userId) {
        UserInfoResponse user = authService.getUserById(String.valueOf(userId));
        return new ResponseEntity<String>(user.getEmail(), HttpStatus.OK);
    }

    @PutMapping("/update-info")
    @RequireRole("ROLE_USER")
    public ResponseEntity<UserInfoResponse> updateUserInfo(@RequestBody UpdateUserRequest updateUserRequest, HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        UserInfoResponse user = authService.updateUserById(updateUserRequest, userId);
        return new ResponseEntity<UserInfoResponse>(user, HttpStatus.OK);
    }


    @GetMapping("/roles")
//    @RequireRole("ROLE_SELLER")
    public ResponseEntity<RoleResponse> getAllRoles() {
        RoleResponse roleResponse = authService.getAllRoles();
        return new ResponseEntity<>(roleResponse, HttpStatus.OK);
    }


}
