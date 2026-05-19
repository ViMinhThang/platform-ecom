package com.ecom.notification.client;

import com.ecom.common.util.APIResponse;
import com.ecom.notification.dto.UserDTO;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface UserServiceClient {

    @GetExchange("/users/{userId}")
    APIResponse<UserDTO> getUser(@PathVariable("userId") Long userId);
}
