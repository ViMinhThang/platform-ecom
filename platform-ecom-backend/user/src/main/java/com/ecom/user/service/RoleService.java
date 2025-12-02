package com.ecom.user.service;

import com.ecom.user.dtos.RoleResponse;
import com.ecom.user.entity.AppRole;
import com.ecom.user.entity.Role;

import java.util.Set;

public interface RoleService {
    RoleResponse getAllRoles();

    Role getRole(AppRole roleName);

    Set<Role> resolveRoles(Set<String> strRoles);
}
