package com.ecom.product.repository;

import com.ecom.product.entity.DescriptionImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DescriptionImageRepository extends JpaRepository<DescriptionImage, Long> {

    Optional<DescriptionImage> findByProductIdAndId(Long productId, Long id);

    List<DescriptionImage> findByDeletedTrueAndDeletedAtBefore(LocalDateTime dateTime);
}
