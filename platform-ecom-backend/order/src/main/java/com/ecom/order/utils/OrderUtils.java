package com.ecom.order.utils;

import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.OrderGroupStatus;
import com.ecom.order.entity.PaymentStatus;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class OrderUtils {

    public static Specification<OrderGroup> groupNumberContains(String groupNumber) {
        if (groupNumber == null || groupNumber.isEmpty())
            return null;
        return (root, query, cb) -> cb.like(cb.lower(root.get("groupNumber")), "%" + groupNumber.toLowerCase() + "%");
    }

    public static Specification<OrderGroup> userIdEquals(Long userId) {
        if (userId == null)
            return null;
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<OrderGroup> overallStatusEquals(String status) {
        if (status == null || status.isEmpty())
            return null;
        try {
            OrderGroupStatus orderStatus = OrderGroupStatus.valueOf(status);
            return (root, query, cb) -> cb.equal(root.get("overallStatus"), orderStatus);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static Specification<OrderGroup> paymentStatusEquals(String status) {
        if (status == null || status.isEmpty())
            return null;
        try {
            PaymentStatus paymentStatus = PaymentStatus.valueOf(status);
            return (root, query, cb) -> cb.equal(root.get("paymentStatus"), paymentStatus);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static Specification<OrderGroup> createdBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            if (startDate != null && endDate != null) {
                LocalDateTime start = startDate.atStartOfDay();
                LocalDateTime end = endDate.plusDays(1).atStartOfDay();
                return cb.between(root.get("createdAt"), start, end);
            } else if (startDate != null) {
                LocalDateTime start = startDate.atStartOfDay();
                return cb.greaterThanOrEqualTo(root.get("createdAt"), start);
            } else if (endDate != null) {
                LocalDateTime end = endDate.plusDays(1).atStartOfDay();
                return cb.lessThan(root.get("createdAt"), end);
            }
            return null;
        };
    }

    public static Specification<OrderGroup> totalAmountBetween(BigDecimal minAmount, BigDecimal maxAmount) {
        return (root, query, cb) -> {
            if (minAmount != null && maxAmount != null) {
                return cb.between(root.get("totalAmount"), minAmount, maxAmount);
            } else if (minAmount != null) {
                return cb.greaterThanOrEqualTo(root.get("totalAmount"), minAmount);
            } else if (maxAmount != null) {
                return cb.lessThanOrEqualTo(root.get("totalAmount"), maxAmount);
            }
            return null;
        };
    }

    public static Specification<OrderGroup> hasSubOrderWithSeller(String sellerName) {
        if (sellerName == null || sellerName.isEmpty())
            return null;
        return (root, query, cb) -> cb.like(
                cb.lower(root.join("subOrders").get("sellerName")),
                "%" + sellerName.toLowerCase() + "%");
    }
}
