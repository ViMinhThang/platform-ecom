package com.ecom.order.dto;

import com.ecom.common.util.PaginationRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderFilterRequest extends PaginationRequest {
    private String groupNumber;
    private String userEmail;
    private String userName;
    private String overallStatus;
    private String paymentStatus;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private String sellerName;
}
