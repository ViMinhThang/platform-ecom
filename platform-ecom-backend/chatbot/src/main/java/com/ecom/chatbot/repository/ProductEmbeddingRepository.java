package com.ecom.chatbot.repository;

import com.ecom.chatbot.entity.ProductEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Repository
public interface ProductEmbeddingRepository extends JpaRepository<ProductEmbedding, Long> {


        @Query(value = """
                        SELECT pe.product_id, pe.product_name, pe.product_slug, pe.description,
                               pe.category_name, pe.min_price, pe.average_rating, pe.total_sold,
                               pe.updated_at, pe.embedding,
                               1 - (pe.embedding <=> cast(:queryVector as vector)) as similarity
                        FROM product_embeddings pe
                        WHERE pe.embedding IS NOT NULL
                        ORDER BY pe.embedding <=> cast(:queryVector as vector)
                        LIMIT :limit
                        """, nativeQuery = true)
        List<Object[]> findSimilarProducts(
                        @Param("queryVector") String queryVector,
                        @Param("limit") int limit);

        @Modifying
        @Query(value = """
                        INSERT INTO product_embeddings
                            (product_id, product_name, product_slug, description, category_name,
                             embedding, min_price, average_rating, total_sold, updated_at)
                        VALUES
                            (:productId, :productName, :productSlug, :description, :categoryName,
                             cast(:embedding as vector), :minPrice, :averageRating, :totalSold, NOW())
                        ON CONFLICT (product_id) DO UPDATE SET
                            product_name = EXCLUDED.product_name,
                            product_slug = EXCLUDED.product_slug,
                            description = EXCLUDED.description,
                            category_name = EXCLUDED.category_name,
                            embedding = EXCLUDED.embedding,
                            min_price = EXCLUDED.min_price,
                            average_rating = EXCLUDED.average_rating,
                            total_sold = EXCLUDED.total_sold,
                            updated_at = NOW()
                        """, nativeQuery = true)
        void upsertProductEmbedding(
                        @Param("productId") Long productId,
                        @Param("productName") String productName,
                        @Param("productSlug") String productSlug,
                        @Param("description") String description,
                        @Param("categoryName") String categoryName,
                        @Param("embedding") String embedding,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("averageRating") Double averageRating,
                        @Param("totalSold") Long totalSold);

        Optional<ProductEmbedding> findByProductSlug(String productSlug);

        List<ProductEmbedding> findByProductIdIn(List<Long> productIds);


        boolean existsByProductId(Long productId);


        @Query(value = "SELECT COUNT(*) FROM product_embeddings WHERE embedding IS NOT NULL", nativeQuery = true)
        long countWithEmbeddings();
}
