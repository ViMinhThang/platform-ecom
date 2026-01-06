package com.ecom.product.entity;

import com.ecom.product.enums.FlashSaleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "flash_sales", indexes = {
        @Index(name = "idx_flash_sale_status", columnList = "status"),
        @Index(name = "idx_flash_sale_start_time", columnList = "start_time"),
        @Index(name = "idx_flash_sale_end_time", columnList = "end_time"),
        @Index(name = "idx_flash_sale_slug", columnList = "slug"),
        @Index(name = "idx_flash_sale_deleted", columnList = "deleted")
})
@SQLDelete(sql = "UPDATE flash_sales SET deleted = true WHERE id = ?")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSale {

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
    private FlashSaleStatus status = FlashSaleStatus.DRAFT;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "flashSale", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<FlashSaleItem> items = new ArrayList<>();

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

    public void addItem(FlashSaleItem item) {
        items.add(item);
        item.setFlashSale(this);
    }

    public void removeItem(FlashSaleItem item) {
        items.remove(item);
        item.setFlashSale(null);
    }

    public boolean isActiveNow() {
        LocalDateTime now = LocalDateTime.now();
        return status == FlashSaleStatus.ACTIVE
                && now.isAfter(startTime)
                && now.isBefore(endTime);
    }

    public long getRemainingSeconds() {
        if (!isActiveNow()) return 0;
        return java.time.Duration.between(LocalDateTime.now(), endTime).getSeconds();
    }
}
