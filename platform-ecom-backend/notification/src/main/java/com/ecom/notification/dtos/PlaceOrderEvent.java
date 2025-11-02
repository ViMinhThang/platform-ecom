package com.ecom.notification.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderEvent {
    private String email;
    private Long orderId;
    private String status;
    private Double totalAmount;
}
