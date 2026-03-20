package com.ecom.product.repository;

import com.ecom.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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

    /**
     * Find products by status with pagination (for embedding sync)
     */
    @EntityGraph(attributePaths = {"category", "variants", "images"})
    @Query("SELECT p FROM Product p WHERE p.status = :status AND p.deleted = false")
    Page<Product> findAllActiveForSync(@Param("status") String status, Pageable pageable);

    // ==================== Vector Search Queries ====================

    /**
     * Vector similarity search - finds products most similar to query vector
     */
    @Query(value = """
                  SELECT p.id, p.name, p.slug, p.description, c.name as category_name,
                         p.min_price, p.max_price, p.average_rating, p.total_sold, p.updated_at,
                         (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url,
                         1 - (p.embedding <=> cast(:queryVector as vector)) as similarity
                  FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.embedding IS NOT NULL AND p.deleted = false
                  ORDER BY p.embedding <=> cast(:queryVector as vector)
                  LIMIT :limit
                  """, nativeQuery = true)
    List<Object[]> findSimilarProducts(@Param("queryVector") String queryVector, @Param("limit") int limit);

    /**
     * Vector similarity search with price range filter
     */
    @Query(value = """
                  SELECT p.id, p.name, p.slug, p.description, c.name as category_name,
                         p.min_price, p.max_price, p.average_rating, p.total_sold, p.updated_at,
                         (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url,
                         1 - (p.embedding <=> cast(:queryVector as vector)) as similarity
                  FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.embedding IS NOT NULL AND p.deleted = false
                    AND p.min_price >= :minPrice AND p.min_price <= :maxPrice
                  ORDER BY p.embedding <=> cast(:queryVector as vector)
                  LIMIT :limit
                  """, nativeQuery = true)
    List<Object[]> findSimilarProductsWithPriceRange(
                  @Param("queryVector") String queryVector,
                  @Param("minPrice") BigDecimal minPrice,
                  @Param("maxPrice") BigDecimal maxPrice,
                  @Param("limit") int limit);

    /**
     * Update product embedding
     */
    @Modifying
    @Query(value = "UPDATE products SET embedding = cast(:embedding as vector), updated_at = CURRENT_TIMESTAMP WHERE id = :productId", nativeQuery = true)
    void updateEmbedding(@Param("productId") Long productId, @Param("embedding") String embedding);

    /**
     * Find products without embedding (for sync)
     */
    @Query("SELECT p.id FROM Product p WHERE p.embedding IS NULL AND p.deleted = false")
    List<Long> findProductIdsWithoutEmbedding();

    /**
     * Find products with embedding
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.embedding IS NOT NULL AND p.deleted = false")
    long countWithEmbeddings();

    /**
     * Find by price range without vector search
     */
    @Query(value = """
                  SELECT p.id, p.name, p.slug, p.description, c.name as category_name,
                   p.min_price, p.max_price, p.average_rating, p.total_sold, p.updated_at,
                          (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url,
                          1.0 as similarity
                   FROM products p
                   LEFT JOIN categories c ON p.category_id = c.id
                   WHERE p.deleted = false AND p.min_price BETWEEN :minPrice AND :maxPrice
                  ORDER BY p.total_sold DESC NULLS LAST
                  LIMIT :limit
                  """, nativeQuery = true)
    List<Object[]> findByPriceRange(
                  @Param("minPrice") BigDecimal minPrice,
                  @Param("maxPrice") BigDecimal maxPrice,
                  @Param("limit") int limit);

    /**
     * Find by brand/category name
     */
    @Query(value = """
                  SELECT p.id, p.name, p.slug, p.description, c.name as category_name,
                   p.min_price, p.max_price, p.average_rating, p.total_sold, p.updated_at,
                          (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url,
                          1.0 as similarity
                   FROM products p
                   LEFT JOIN categories c ON p.category_id = c.id
                   WHERE p.deleted = false
                     AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :brand, '%'))
                         OR LOWER(c.name) LIKE LOWER(CONCAT('%', :brand, '%')))
                  ORDER BY p.total_sold DESC NULLS LAST
                  LIMIT :limit
                  """, nativeQuery = true)
    List<Object[]> findByBrand(@Param("brand") String brand, @Param("limit") int limit);

    /**
     * Dynamic sort without vector search
     */
    @Query(value = """
                  SELECT p.id, p.name, p.slug, p.description, c.name as category_name,
                   p.min_price, p.max_price, p.average_rating, p.total_sold, p.updated_at,
                          (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url,
                          1.0 as similarity
                   FROM products p
                   LEFT JOIN categories c ON p.category_id = c.id
                   WHERE p.deleted = false
                     AND (:keyword = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                          OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
                   ORDER BY
                      CASE WHEN :sortBy = 'price' THEN p.min_price END ASC,
                     CASE WHEN :sortBy = 'average_rating' THEN p.average_rating END ASC,
                     CASE WHEN :sortBy = 'total_sold' THEN p.total_sold END ASC
                  NULLS LAST
                  LIMIT :limit
                  """, nativeQuery = true)
    List<Object[]> findProductsDynamicSortAsc(
                  @Param("keyword") String keyword,
                  @Param("sortBy") String sortBy,
                  @Param("limit") int limit);

    @Query(value = """
                  SELECT p.id, p.name, p.slug, p.description, c.name as category_name,
                   p.min_price, p.max_price, p.average_rating, p.total_sold, p.updated_at,
                          (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url,
                          1.0 as similarity
                   FROM products p
                   LEFT JOIN categories c ON p.category_id = c.id
                   WHERE p.deleted = false
                     AND (:keyword = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                          OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
                   ORDER BY
                      CASE WHEN :sortBy = 'price' THEN p.min_price END DESC,
                     CASE WHEN :sortBy = 'average_rating' THEN p.average_rating END DESC,
                     CASE WHEN :sortBy = 'total_sold' THEN p.total_sold END DESC
                  NULLS LAST
                  LIMIT :limit
                  """, nativeQuery = true)
    List<Object[]> findProductsDynamicSortDesc(
                  @Param("keyword") String keyword,
                  @Param("sortBy") String sortBy,
                  @Param("limit") int limit);
}

