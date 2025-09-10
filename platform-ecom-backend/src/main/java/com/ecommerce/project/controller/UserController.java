package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.payload.UserDTO;
import com.ecommerce.project.payload.UserResponse;
import com.ecommerce.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/admin/users")
    public ResponseEntity<UserResponse> getUsers(@RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                 @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                 @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
                                                 @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        UserResponse userResponse = userService.getAllUsers(pageNumber, pageSize, sortBy, sortOrder);

        return new ResponseEntity<UserResponse>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/admin/users/roles")
    public ResponseEntity<List<Role>> getRoles() {

        List<Role> rolesList = userService.getAllRoles();

        return new ResponseEntity<List<Role>>(rolesList, HttpStatus.OK);
    }

    @PostMapping("/admin/users")
    public ResponseEntity<UserDTO> getRoles(@RequestBody UserDTO userDTO) {

        UserDTO user = userService.addUser(userDTO);

        return new ResponseEntity<UserDTO>(user, HttpStatus.OK);
    }


    @GetMapping("/admin/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {

        UserDTO userDTO = userService.getUserById(userId);

        return new ResponseEntity<UserDTO>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/admin/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId,
                                               @RequestBody UserDTO userDTO) {

        UserDTO user = userService.updateUserById(userId,userDTO);

        return new ResponseEntity<UserDTO>(userDTO, HttpStatus.OK);
    }

    @DeleteMapping("/admin/users/{userId}")
    public ResponseEntity<Map<String,String>> deleteUser(@PathVariable Long userId) {

        String status  = userService.deleteUserById(userId);
        Map<String,String> resp = new HashMap<>();
        resp.put("status","status");
        return new ResponseEntity<Map<String,String>>(resp, HttpStatus.OK);
    }

//    @PutMapping("/admin/users/{userId}")
//    public ResponseEntity<UserDTO> getRoles(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
//
//        UserDTO user = userService.updateUser(userId, userDTO);
//
//        return new ResponseEntity<UserDTO>(user, HttpStatus.OK);
//    }
}
