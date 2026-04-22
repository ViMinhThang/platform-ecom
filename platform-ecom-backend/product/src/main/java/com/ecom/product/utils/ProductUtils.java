package com.ecom.product.utils;

import com.ecom.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductUtils {

    public static Specification<Product> userIdEquals(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<Product> nameContains(String name) {
        if (name == null || name.isEmpty())
            return null;
        return (root, query, cb) -> cb.greaterThan(
                cb.function("word_similarity", Double.class, cb.literal(name), root.get("name")),
                0.3);
    }

    public static Specification<Product> categoryEquals(String category) {
        if (category == null || category.isEmpty())
            return null;
        return (root, query, cb) -> cb.equal(root.get("category").get("name"), category);
    }

    public static Specification<Product> categorySlugEquals(String slug) {
        if (slug == null || slug.isEmpty())
            return null;
        return (root, query, cb) -> cb.equal(root.get("category").get("slug"), slug);
    }

    public static Specification<Product> statusEquals(String status) {
        if (status == null || status.isEmpty())
            return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Product> deletedEquals(Boolean deleted) {
        if (deleted == null)
            return null;
        return (root, query, cb) -> cb.equal(root.get("deleted"), deleted);
    }

    public static Specification<Product> isNotDeleted() {
        return (root, query, cb) -> cb.equal(root.get("deleted"), false);
    }

    public static Specification<Product> ratingGreaterThanOrEqual(Double minRating) {
        if (minRating == null)
            return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("averageRating"), minRating);
    }

    public static Specification<Product> priceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice != null && maxPrice != null) {
                return cb.and(
                        cb.greaterThanOrEqualTo(root.get("minPrice"), minPrice),
                        cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice));
            } else if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("minPrice"), minPrice);
            } else if (maxPrice != null) {
                return cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice);
            }
            return null;
        };
    }

    public static Specification<Product> hasStock(Boolean inStock) {
        if (inStock == null || !inStock)
            return null;
        return (root, query, cb) -> {
            query.distinct(true);
            return cb.greaterThan(root.join("variants").get("stock"), 0);
        };
    }

    public static Specification<Product> userIdIn(java.util.List<Long> userIds) {
        if (userIds == null || userIds.isEmpty())
            return null;
        return (root, query, cb) -> root.get("userId").in(userIds);
    }
}
