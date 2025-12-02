package com.ecom.order.client;


import com.ecom.order.dtos.AddressDTO;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange()
public interface UserServiceClient {

    @GetExchange("/addresses/{addressId}")
    AddressDTO getAddressById(@PathVariable("addressId") Long addressId);


    @GetExchange("/auth/get-email-by-user-id/{userId}")
    String getEmailById(@PathVariable("userId") Long userId);

    @GetExchange("/auth/{userId}")
    org.springframework.http.ResponseEntity<com.ecom.common.util.APIResponse<com.ecom.order.dtos.UserInfoResponse>> getUserInfo(@PathVariable("userId") Long userId);
}
