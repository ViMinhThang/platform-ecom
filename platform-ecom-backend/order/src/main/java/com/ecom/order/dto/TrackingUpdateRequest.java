package com.ecom.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingUpdateRequest {
    private String trackingNumber;
    private String trackingUrl;
    private String carrier;
    private LocalDate estimatedDelivery;
    private String fulfillmentStatus;
}
