package com.ecom.product.entity;

import com.ecom.product.enums.SaleCampaignStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sale_campaigns", indexes = {
        @Index(name = "idx_sale_campaign_status", columnList = "status"),
        @Index(name = "idx_sale_campaign_start_time", columnList = "start_time"),
        @Index(name = "idx_sale_campaign_end_time", columnList = "end_time"),
        @Index(name = "idx_sale_campaign_slug", columnList = "slug"),
        @Index(name = "idx_sale_campaign_deleted", columnList = "deleted")
})
@SQLDelete(sql = "UPDATE sale_campaigns SET deleted = true WHERE id = ?")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String name;

    @Column(unique = true, nullable = false, length = 255)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    @Builder.Default
    private SaleCampaignStatus status = SaleCampaignStatus.DRAFT;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "saleCampaign", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SaleCampaignItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "saleCampaign", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SaleCampaignCategory> categories = new ArrayList<>();

    @OneToMany(mappedBy = "saleCampaign", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SaleCampaignDiscountTier> discountTiers = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted")
    @Builder.Default
    private Boolean deleted = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (slug == null) {
            slug = name.toLowerCase()
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .replaceAll("\\s+", "-");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addItem(SaleCampaignItem item) {
        items.add(item);
        item.setSaleCampaign(this);
    }

    public void removeItem(SaleCampaignItem item) {
        items.remove(item);
        item.setSaleCampaign(null);
    }

    public void addCategory(SaleCampaignCategory category) {
        categories.add(category);
        category.setSaleCampaign(this);
    }

    public void removeCategory(SaleCampaignCategory category) {
        categories.remove(category);
        category.setSaleCampaign(null);
    }

    public void addDiscountTier(SaleCampaignDiscountTier tier) {
        discountTiers.add(tier);
        tier.setSaleCampaign(this);
    }

    public void removeDiscountTier(SaleCampaignDiscountTier tier) {
        discountTiers.remove(tier);
        tier.setSaleCampaign(null);
    }

    public boolean isActiveNow() {
        LocalDateTime now = LocalDateTime.now();
        return status == SaleCampaignStatus.ACTIVE
                && now.isAfter(startTime)
                && now.isBefore(endTime);
    }

    public long getRemainingSeconds() {
        if (!isActiveNow())
            return 0;
        return java.time.Duration.between(LocalDateTime.now(), endTime).getSeconds();
    }
}
