package com.ecom.promotion.helper;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.promotion.dto.CartItemDTO;
import com.ecom.promotion.dto.request.GenerateVoucherFromCampaignRequest;
import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.enums.VoucherStatus;
import com.ecom.promotion.repository.VoucherRepository;
import com.ecom.promotion.repository.VoucherUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class VoucherHelper {

    private final VoucherRepository voucherRepository;
    private final VoucherUsageRepository usageRepository;

    public Voucher findByIdOrThrow(Long id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher", "id", id));
    }

    public void validateTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime.isBefore(startTime)) {
            throw new APIException("End time must be after start time");
        }
    }

    public boolean canUserUseVoucher(Voucher voucher, Long userId) {
        if (!voucher.canBeUsed()) {
            return false;
        }

        if (voucher.getUsageLimitPerUser() != null && userId != null) {
            long userUsage = usageRepository.countByVoucherIdAndUserId(voucher.getId(), userId);
            if (userUsage >= voucher.getUsageLimitPerUser()) {
                return false;
            }
        }

        return true;
    }

    public VoucherStatus determineStatus(LocalDateTime startTime) {
        return LocalDateTime.now().isBefore(startTime)
                ? VoucherStatus.SCHEDULED
                : VoucherStatus.ACTIVE;
    }

    public BigDecimal calculateAverageDiscount(GenerateVoucherFromCampaignRequest request) {
        if (request.getItems().isEmpty()) {
            return BigDecimal.ZERO;
        }
        int totalPercent = request.getItems().stream()
                .mapToInt(GenerateVoucherFromCampaignRequest.VoucherItemRequest::getDiscountPercent)
                .sum();
        return BigDecimal.valueOf(totalPercent / request.getItems().size());
    }



    public BigDecimal calculateItemsTotal(List<CartItemDTO> items) {
        return items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Voucher buildVoucher(com.ecom.promotion.dto.request.CreateVoucherRequest request) {
        Voucher voucher = Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .categoryId(request.getCategoryId())
                .applyMode(request.getApplyMode())
                .status(VoucherStatus.DRAFT)
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .usageLimit(request.getUsageLimit())
                .usageLimitPerUser(request.getUsageLimitPerUser())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        return voucher;
    }

    public void updateVoucherDetails(Voucher voucher, com.ecom.promotion.dto.request.CreateVoucherRequest request) {
        voucher.setName(request.getName());
        voucher.setDescription(request.getDescription());
        voucher.setType(request.getType());
        voucher.setCategoryId(request.getCategoryId());
        voucher.setApplyMode(request.getApplyMode());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMinOrderAmount(request.getMinOrderAmount());
        voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());
        voucher.setUsageLimit(request.getUsageLimit());
        voucher.setUsageLimitPerUser(request.getUsageLimitPerUser());
        voucher.setStartTime(request.getStartTime());
        voucher.setEndTime(request.getEndTime());

    }
}
