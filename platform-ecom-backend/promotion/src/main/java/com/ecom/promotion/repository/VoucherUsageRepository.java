package com.ecom.promotion.repository;

import com.ecom.promotion.entity.VoucherUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Long> {

    List<VoucherUsage> findByVoucherId(Long voucherId);

    List<VoucherUsage> findByUserId(Long userId);

    boolean existsByVoucherIdAndOrderId(Long voucherId, Long orderId);

    /**
     * Count how many times a user has used a specific voucher
     */
    @Query("SELECT COUNT(vu) FROM VoucherUsage vu WHERE vu.voucher.id = :voucherId AND vu.userId = :userId")
    long countByVoucherIdAndUserId(@Param("voucherId") Long voucherId, @Param("userId") Long userId);
}
