package com.ecom.user.dtos.response;

import com.ecom.user.dtos.RoleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponse {
    List<RoleDTO> allRoles;
}
