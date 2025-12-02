package com.ecom.user.dtos;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoResponse {
    private Long userId;
    private String username;
    private String email;
    private String imageUrl;
    private String isActive;
    private List<String> roles;
    private List<AddressDTO> addresses;
}
