package com.ecom.product.repositories;

import com.ecom.product.entity.Category;
import com.ecom.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageDetails);

    Page<Product> findByProductNameLikeIgnoreCase(String s, Pageable pageDetails);

    Page<Product> findByUserId(Long userId, Pageable pageDetails);
    List<Product> findByUserId(Long userId);
}
