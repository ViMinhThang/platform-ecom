package com.ecom.user.service;

import com.ecom.user.dtos.RoleDTO;
import com.ecom.user.dtos.RoleResponse;
import com.ecom.user.entity.AppRole;
import com.ecom.user.entity.Role;
import com.ecom.user.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    @Override
    public RoleResponse getAllRoles() {
        List<RoleDTO> roleDTOList = roleRepository.findAll().stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .toList();
        return new RoleResponse(roleDTOList);
    }

    @Override
    public Role getRole(AppRole roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " is not found."));
    }

    @Override
    public Set<Role> resolveRoles(Set<String> strRoles) {
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(getRole(AppRole.ROLE_USER));
            return roles;
        }
        strRoles.forEach(role -> {
            switch (role.toLowerCase()) {
                case "admin":
                    roles.add(getRole(AppRole.ROLE_ADMIN));
                    break;
                case "seller":
                    roles.add(getRole(AppRole.ROLE_SELLER));
                    break;
                default:
                    roles.add(getRole(AppRole.ROLE_USER));
            }
        });
        return roles;
    }
}
