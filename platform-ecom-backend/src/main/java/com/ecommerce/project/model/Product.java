package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    @NotBlank
    @Size(min = 3)
    private String productName;

    private String slug;

    private String image;

    @NotBlank
    @Size(min = 6)
    private String description;

    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;
    private String type;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private List<CartItem> products = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<Asset> assets = new ArrayList<>();

    private String isAvailable;


    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (productName != null && !productName.isEmpty()) {
            this.slug = toSlug(this.productName);
        }
    }

    private String toSlug(String input) {
        String slug = input.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
        return slug;
    }
}
