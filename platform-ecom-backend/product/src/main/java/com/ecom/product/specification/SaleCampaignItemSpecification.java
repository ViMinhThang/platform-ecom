package com.ecom.product.specification;

import com.ecom.product.entity.SaleCampaignItem;
import com.ecom.product.entity.SaleCampaign;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SaleCampaignItemSpecification {

    public static Specification<SaleCampaignItem> filter(
            Long saleCampaignId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStockOnly) {
        
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by Campaign ID
            if (saleCampaignId != null) {
                Join<SaleCampaignItem, SaleCampaign> campaignJoin = root.join("saleCampaign");
                predicates.add(criteriaBuilder.equal(campaignJoin.get("id"), saleCampaignId));
            }

            // Filter by Price Range
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("salePrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("salePrice"), maxPrice));
            }

            // Filter by Stock (inStockOnly = true)
            if (Boolean.TRUE.equals(inStockOnly)) {
                // remainingStock = stockLimit - soldCount > 0
                // stockLimit > soldCount
                predicates.add(criteriaBuilder.greaterThan(root.get("stockLimit"), root.get("soldCount")));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
