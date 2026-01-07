package com.ecom.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sale_campaign_categories", indexes = {
        @Index(name = "idx_sale_campaign_category_campaign", columnList = "sale_campaign_id"),
        @Index(name = "idx_sale_campaign_category_category", columnList = "category_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_sale_campaign_category", columnNames = { "sale_campaign_id", "category_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleCampaignCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_campaign_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private SaleCampaign saleCampaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Category category;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
