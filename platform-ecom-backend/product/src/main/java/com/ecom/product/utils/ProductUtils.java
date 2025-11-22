package com.ecom.product.utils;

import com.ecom.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

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
}
