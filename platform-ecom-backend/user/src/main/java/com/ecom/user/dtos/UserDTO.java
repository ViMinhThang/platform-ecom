package com.ecom.user.dtos;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ecom.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long userId;
    private String username;
    private String email;
    private String password;
    private Boolean isActive;
    private String imageUrl;
    private Set<Role> roles = new HashSet<>();
    private List<AddressDTO> addresses = new ArrayList<>();
}