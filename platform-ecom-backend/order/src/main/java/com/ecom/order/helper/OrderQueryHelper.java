package com.ecom.order.helper;

import com.ecom.order.dto.OrderFilterRequest;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.utils.OrderUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class OrderQueryHelper {

    public Specification<OrderGroup> buildFilterSpecification(OrderFilterRequest filter) {
        Specification<OrderGroup> spec = Specification.where(null);

        if (filter.getGroupNumber() != null) {
            spec = spec.and(OrderUtils.groupNumberContains(filter.getGroupNumber()));
        }
        if (filter.getOverallStatus() != null) {
            spec = spec.and(OrderUtils.overallStatusEquals(filter.getOverallStatus()));
        }
        if (filter.getPaymentStatus() != null) {
            spec = spec.and(OrderUtils.paymentStatusEquals(filter.getPaymentStatus()));
        }
        if (filter.getStartDate() != null || filter.getEndDate() != null) {
            spec = spec.and(OrderUtils.createdBetween(filter.getStartDate(), filter.getEndDate()));
        }
        if (filter.getMinAmount() != null || filter.getMaxAmount() != null) {
            spec = spec.and(OrderUtils.totalAmountBetween(filter.getMinAmount(), filter.getMaxAmount()));
        }
        if (filter.getSellerName() != null) {
            spec = spec.and(OrderUtils.hasSubOrderWithSeller(filter.getSellerName()));
        }
        return spec;
    }

    public Pageable buildPageable(OrderFilterRequest filter) {
        return PageRequest.of(filter.getPageNumber(), filter.getPageSize(),
                filter.getSortDirection(), filter.getSortBy());
    }
}
