package com.ecom.promotion.entity;

import com.ecom.promotion.enums.ScopeType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "voucher_scopes", indexes = {
        @Index(name = "idx_voucher_scope_voucher", columnList = "voucher_id"),
        @Index(name = "idx_voucher_scope_target", columnList = "scope_type, target_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherScope {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Voucher voucher;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope_type", nullable = false, length = 20)
    private ScopeType scopeType;

    @Column(name = "target_id")
    private Long targetId; // productId, variantId, categoryId (null for ALL)

    /**
     * Check if this scope matches a given target
     */
    public boolean matches(Long productId, Long variantId, Long categoryId) {
        return switch (scopeType) {
            case ALL -> true;
            case PRODUCT -> targetId != null && targetId.equals(productId);
            case VARIANT -> targetId != null && targetId.equals(variantId);
            case CATEGORY -> targetId != null && targetId.equals(categoryId);
        };
    }
}
