package com.ecommerce.project.payload;


import com.ecommerce.project.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long userId;

    private String username;

    private String email;

    private String password = "111111";
    private Set<Role> roles = new HashSet<>();
    private List<AddressDTO> addresses = new ArrayList<>();
    private String isAvailable;
}
