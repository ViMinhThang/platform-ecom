package com.ecom.product.repository;

import com.ecom.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    /**
     * Find product by ID with all associations eagerly loaded to avoid N+1 queries
     */
    @EntityGraph(attributePaths = {"category", "variants", "images", "options"})
    Optional<Product> findWithAssociationsById(Long id);
    
    /**
     * Find all products with specifications and eagerly load associations to avoid N+1 queries
     */
    @EntityGraph(attributePaths = {"category", "variants", "images"})
    @Override
    Page<Product> findAll(org.springframework.data.jpa.domain.Specification<Product> spec, Pageable pageable);
    
    /**
     * Find product by ID and user ID
     */
    Optional<Product> findByIdAndUserId(Long id, Long userId);
    
    /**
     * Find products by status with deleted check
     */
    @EntityGraph(attributePaths = {"category", "variants", "images"})
    Page<Product> findByStatusAndDeletedFalse(String status, Pageable pageable);
    
    /**
     * Find active products by category
     */
    @EntityGraph(attributePaths = {"category", "variants", "images"})
    @Query("SELECT p FROM Product p WHERE p.status = :status AND p.deleted = false " +
           "AND p.category.id = :categoryId")
    Page<Product> findActiveProductsByCategory(@Param("status") String status, 
                                               @Param("categoryId") Long categoryId, 
                                               Pageable pageable);
    
    /**
     * Count products by user ID and status
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.userId = :userId AND p.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    /**
     * Batch fetch products with all associations to avoid N+1
     */
    @EntityGraph(attributePaths = {"category", "variants", "images", "options"})
    @Query("SELECT DISTINCT p FROM Product p WHERE p.id IN :productIds")
    List<Product> findAllWithAssociations(@Param("productIds") List<Long> productIds);

    /**
     * Find top sellers by category slug
     * Returns userId and total sales aggregated
     */
    @Query("SELECT p.userId, SUM(p.totalSold) as sales FROM Product p " +
           "WHERE p.category.slug = :categorySlug AND p.status = 'ACTIVE' AND p.deleted = false " +
           "GROUP BY p.userId ORDER BY sales DESC")
    List<Object[]> findTopSellersByCategorySlug(@Param("categorySlug") String categorySlug, Pageable pageable);

    /**
     * Find product by slug with all associations
     */
    @EntityGraph(attributePaths = {"category", "variants", "images", "options"})
    Optional<Product> findBySlugAndDeletedFalse(String slug);

    /**
     * Find all product IDs by seller user ID
     */
    @Query("SELECT p.id FROM Product p WHERE p.userId = :userId AND p.deleted = false")
    List<Long> findIdsByUserId(@Param("userId") Long userId);
}

