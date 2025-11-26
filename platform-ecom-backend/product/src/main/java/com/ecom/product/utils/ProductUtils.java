package com.ecom.product.utils;

import com.ecom.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductUtils {

    public static Specification<Product> userIdEquals(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<Product> nameContains(String name) {
        if (name == null || name.isEmpty()) return null;
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Product> categoryEquals(String category) {
        if (category == null || category.isEmpty()) return null;
        return (root, query, cb) -> cb.equal(root.get("category").get("name"), category);
    }

    public static Specification<Product> statusEquals(String status) {
        if (status == null || status.isEmpty()) return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Product> priceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice != null && maxPrice != null) {
                return cb.and(
                    cb.greaterThanOrEqualTo(root.get("minPrice"), minPrice),
                    cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice)
                );
            } else if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("minPrice"), minPrice);
            } else if (maxPrice != null) {
                return cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice);
            }
            return null;
        };
    }
}
