package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset,Long> {
    List<Asset> findByProduct_ProductId(Long productId);
}
