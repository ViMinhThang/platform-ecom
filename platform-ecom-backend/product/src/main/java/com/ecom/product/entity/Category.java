package com.ecom.product.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "products")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 5, message = "Category name must contain atleast 5 characters")
    private String name;
    private String imageUrl;
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}