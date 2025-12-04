package com.ecom.order.client;

import com.ecom.common.util.APIResponse;
import com.ecom.order.dto.AddressDTO;
import com.ecom.order.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

/**
 * Client for communicating with User Service
 */
@HttpExchange
public interface UserServiceClient {

    Logger log = LoggerFactory.getLogger(UserServiceClient.class);

    @GetExchange("/users/{userId}")
    APIResponse<UserDTO> getUser(@PathVariable("userId") Long userId);

    @GetExchange("/admin/addresses/internal/addresses/{addressId}")
    APIResponse<AddressDTO> getAddress(@PathVariable("addressId") Long addressId);

    default UserDTO getUserSafe(Long userId) {
        try {
            APIResponse<UserDTO> response = getUser(userId);
            if (response != null && response.isSuccess()) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Error fetching user details for userId: {}", userId, e);
        }
        return null;
    }

    default AddressDTO getAddressSafe(Long addressId) {
        try {
            APIResponse<AddressDTO> response = getAddress(addressId);
            if (response != null && response.isSuccess()) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Error fetching address details for addressId: {}", addressId, e);
        }
        return null;
    }
}
