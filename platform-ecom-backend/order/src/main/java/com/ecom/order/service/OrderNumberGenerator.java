package com.ecom.order.service;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class OrderNumberGenerator {

    private static final String GROUP_PREFIX = "OG-";
    private static final String SUB_ORDER_PREFIX = "-S";


    public String generateGroupNumber() {
        return GROUP_PREFIX + System.currentTimeMillis() + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }


    public String generateSubOrderNumber(String groupNumber, Long sellerId) {
        return groupNumber + SUB_ORDER_PREFIX + sellerId;
    }
}
