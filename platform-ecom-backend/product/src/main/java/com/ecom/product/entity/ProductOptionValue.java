package com.ecom.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_option_values")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "option")
public class ProductOptionValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String value;

    @Column(name = "display_value", nullable = false, length = 100)
    private String displayValue;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id", nullable = false)
    private ProductOption option;
}
