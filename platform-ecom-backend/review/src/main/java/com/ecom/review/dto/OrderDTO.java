package com.ecom.review.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private String overallStatus;
    private List<SubOrderDTO> subOrders;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubOrderDTO {
        private String status;
        private List<SubOrderItemDTO> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubOrderItemDTO {
        private Long productId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Wrapper {
        private String message;
        private boolean success;
        private OrderDTO data;
    }
}
