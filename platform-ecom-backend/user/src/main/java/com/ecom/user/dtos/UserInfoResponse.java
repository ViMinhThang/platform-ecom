package com.ecom.user.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private Long userId;
    private String username;
    private String email;
    private String imageUrl;
    private String isActive;
    private List<String> roles;
}
