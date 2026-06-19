package com.ecom.promotion.repository;

import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.enums.VoucherStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

        Optional<Voucher> findByCode(String code);

        Optional<Voucher> findByCodeAndStatus(String code, VoucherStatus status);

        Page<Voucher> findByStatus(VoucherStatus status, Pageable pageable);

        List<Voucher> findBySaleCampaignId(Long saleCampaignId);

        /**
         * Find all active auto-apply vouchers for current time
         */
        @Query("""
                        SELECT v FROM Voucher v
                        WHERE v.status = 'ACTIVE'
                        AND v.applyMode = 'AUTO'
                        AND v.startTime <= :now
                        AND v.endTime > :now
                        AND (v.usageLimit IS NULL OR v.currentUsageCount < v.usageLimit)
                        """)
        List<Voucher> findActiveAutoApplyVouchers(@Param("now") LocalDateTime now);

    @Query("""
            SELECT v FROM Voucher v
            WHERE v.status = 'ACTIVE'
            AND v.startTime <= :now
            AND v.endTime > :now
            AND (v.usageLimit IS NULL OR v.currentUsageCount < v.usageLimit)
            """)
    List<Voucher> findAllActiveVouchers(@Param("now") LocalDateTime now);



        /**
         * Find vouchers that need status updates (scheduled -> active, active ->
         * expired)
         */
        @Query("""
                        SELECT v FROM Voucher v
                        WHERE (v.status = 'SCHEDULED' AND v.startTime <= :now)
                           OR (v.status = 'ACTIVE' AND v.endTime <= :now)
                        """)
        List<Voucher> findVouchersNeedingStatusUpdate(@Param("now") LocalDateTime now);
}
