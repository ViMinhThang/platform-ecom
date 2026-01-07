package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.FlashSale;
import com.ecom.product.enums.FlashSaleStatus;
import com.ecom.product.repository.FlashSaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FlashSaleStatusHelper {

    private final FlashSaleRepository flashSaleRepository;

    public FlashSale findFlashSaleOrThrow(Long id) {
        return flashSaleRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flash sale not found: " + id));
    }

    public FlashSale activate(FlashSale flashSale) {
        validateActivatable(flashSale);

        if (flashSale.getStartTime().isBefore(LocalDateTime.now())) {
            flashSale.setStatus(FlashSaleStatus.ACTIVE);
        } else {
            flashSale.setStatus(FlashSaleStatus.SCHEDULED);
        }

        flashSale = flashSaleRepository.save(flashSale);
        log.info("Activated flash sale: {} with status: {}", flashSale.getId(), flashSale.getStatus());
        return flashSale;
    }

    public FlashSale cancel(FlashSale flashSale) {
        if (flashSale.getStatus() == FlashSaleStatus.ENDED ||
                flashSale.getStatus() == FlashSaleStatus.CANCELLED) {
            throw new IllegalStateException("Flash sale is already ended or cancelled");
        }

        flashSale.setStatus(FlashSaleStatus.CANCELLED);
        flashSale = flashSaleRepository.save(flashSale);
        log.info("Cancelled flash sale: {}", flashSale.getId());
        return flashSale;
    }

    public void updateScheduledStatuses() {
        LocalDateTime now = LocalDateTime.now();

        List<FlashSale> toActivate = flashSaleRepository.findScheduledFlashSalesToActivate(now);
        for (FlashSale fs : toActivate) {
            fs.setStatus(FlashSaleStatus.ACTIVE);
            flashSaleRepository.save(fs);
            log.info("Auto-activated flash sale: {}", fs.getId());
        }

        List<FlashSale> toEnd = flashSaleRepository.findActiveFlashSalesToEnd(now);
        for (FlashSale fs : toEnd) {
            fs.setStatus(FlashSaleStatus.ENDED);
            flashSaleRepository.save(fs);
            log.info("Auto-ended flash sale: {}", fs.getId());
        }
    }

    public void validateTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in the future");
        }
    }

    private void validateActivatable(FlashSale flashSale) {
        if (flashSale.getStatus() != FlashSaleStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT flash sales can be activated");
        }

        if (flashSale.getItems() == null || flashSale.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot activate flash sale without items");
        }
    }
}
