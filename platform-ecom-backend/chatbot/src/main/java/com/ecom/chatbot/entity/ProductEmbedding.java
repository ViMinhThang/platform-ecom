package com.ecom.chatbot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity to store product vector embeddings for semantic search.
 * Uses pgvector for efficient similarity queries.
 */
@Entity
@Table(name = "product_embeddings", indexes = {
        @Index(name = "idx_product_embeddings_slug", columnList = "product_slug")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEmbedding {

    @Id
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "product_slug", nullable = false, length = 255)
    private String productSlug;

    @Column(name = "price", precision = 19, scale = 2)
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_name", length = 255)
    private String categoryName;

    @Column(name = "embedding", columnDefinition = "vector(768)")
    private String embedding;

    @Column(name = "min_price", precision = 19, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "max_price", precision = 19, scale = 2)
    private BigDecimal maxPrice;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "total_sold")
    private Long totalSold;

    @Column(name = "image_url", length = 2000)
    private String imageUrl;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
