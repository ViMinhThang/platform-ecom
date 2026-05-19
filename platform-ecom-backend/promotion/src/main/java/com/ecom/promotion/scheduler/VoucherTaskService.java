package com.ecom.promotion.scheduler;

import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.enums.VoucherStatus;
import com.ecom.promotion.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoucherTaskService {

    private final VoucherRepository voucherRepository;

    @Transactional
    @Scheduled(fixedRate = 60000) // Run every minute
    public void updateVoucherStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findVouchersNeedingStatusUpdate(now);

        for (Voucher voucher : vouchers) {
            if (voucher.getStatus() == VoucherStatus.SCHEDULED && now.isAfter(voucher.getStartTime())) {
                voucher.setStatus(VoucherStatus.ACTIVE);
                log.info("Voucher {} activated", voucher.getId());
            } else if (voucher.getStatus() == VoucherStatus.ACTIVE && now.isAfter(voucher.getEndTime())) {
                voucher.setStatus(VoucherStatus.EXPIRED);
                log.info("Voucher {} expired", voucher.getId());
            }
        }

        if (!vouchers.isEmpty()) {
            voucherRepository.saveAll(vouchers);
            log.info("Updated status for {} vouchers", vouchers.size());
        }
    }
}
