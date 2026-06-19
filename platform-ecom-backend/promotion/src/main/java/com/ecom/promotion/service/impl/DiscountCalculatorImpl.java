package com.ecom.promotion.service.impl;

import com.ecom.promotion.dto.CartItemDTO;
import com.ecom.promotion.dto.DiscountResult;

import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.entity.VoucherUsage;
import com.ecom.promotion.helper.VoucherHelper;
import com.ecom.promotion.repository.VoucherRepository;
import com.ecom.promotion.repository.VoucherUsageRepository;
import com.ecom.promotion.enums.VoucherStatus;
import com.ecom.promotion.mapper.VoucherMapper;
import com.ecom.promotion.service.signature.DiscountCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class DiscountCalculatorImpl implements DiscountCalculator {

    private final VoucherRepository voucherRepository;
    private final VoucherUsageRepository usageRepository;
    private final VoucherMapper voucherMapper;
    private final VoucherHelper voucherHelper;

    @Override
    @Transactional(readOnly = true)
    public DiscountResult calculateDiscount(
            List<CartItemDTO> items,
            BigDecimal shippingFee,
            List<String> voucherCodes,
            Long userId) {

        BigDecimal itemsTotal = voucherHelper.calculateItemsTotal(items);

        // Get all applicable vouchers
        List<Voucher> applicableVouchers = findApplicableVouchers(items, voucherCodes, userId);

        // Calculate discount for each applicable voucher and select the best one
        VoucherDiscount bestDiscount = new VoucherDiscount(null, BigDecimal.ZERO);
        for (Voucher voucher : applicableVouchers) {
            BigDecimal discount = calculateVoucherDiscount(voucher, items, itemsTotal);
            if (discount.compareTo(bestDiscount.discount) > 0) {
                bestDiscount = new VoucherDiscount(voucher, discount);
            }
        }

        BigDecimal totalDiscount = bestDiscount.discount;
        BigDecimal finalTotal = itemsTotal.add(shippingFee).subtract(totalDiscount);

        DiscountResult result = DiscountResult.builder()
                .originalTotal(itemsTotal.add(shippingFee))
                .productDiscount(totalDiscount)
                .shippingDiscount(BigDecimal.ZERO)
                .totalDiscount(totalDiscount)
                .finalTotal(finalTotal.max(BigDecimal.ZERO))
                .appliedProductVoucher(voucherMapper.toDTO(bestDiscount.voucher))
                .appliedShippingVoucher(null)
                .build();

        if (applicableVouchers.size() > 1) {
            result.addWarning("Multiple vouchers found - only the single best voucher discount was applied");
        }

        return result;
    }

    @Override
    @Transactional
    public DiscountResult applyVouchers(
            Long orderId,
            List<CartItemDTO> items,
            BigDecimal shippingFee,
            List<String> voucherCodes,
            Long userId) {

        DiscountResult result = calculateDiscount(items, shippingFee, voucherCodes, userId);

        // Record usage for applied product voucher
        if (result.getAppliedProductVoucher() != null) {
            recordUsage(result.getAppliedProductVoucher().getId(), userId, orderId);
        }

        return result;
    }

    private List<Voucher> findApplicableVouchers(List<CartItemDTO> items, List<String> voucherCodes, Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = new ArrayList<>();

        // Get auto-apply vouchers
        vouchers.addAll(voucherRepository.findActiveAutoApplyVouchers(now));

        // Add code vouchers if provided
        if (voucherCodes != null && !voucherCodes.isEmpty()) {
            for (String code : voucherCodes) {
                if (code != null && !code.isBlank()) {
                    voucherRepository.findByCodeAndStatus(code, VoucherStatus.ACTIVE)
                            .filter(v -> v.isActiveNow() && voucherHelper.canUserUseVoucher(v, userId))
                            .ifPresent(vouchers::add);
                }
            }
        }

        // Filter by user usability limit
        return vouchers.stream()
                .filter(v -> voucherHelper.canUserUseVoucher(v, userId))
                .distinct()
                .collect(Collectors.toList());
    }

    private BigDecimal calculateVoucherDiscount(Voucher voucher, List<CartItemDTO> items, BigDecimal cartSubtotal) {
        BigDecimal eligibleAmount = cartSubtotal;

        if (voucher.getCategoryId() != null) {
            eligibleAmount = items.stream()
                    .filter(item -> voucher.getCategoryId().equals(item.getCategoryId()))
                    .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        if (voucher.getMinOrderAmount() != null && eligibleAmount.compareTo(voucher.getMinOrderAmount()) < 0) {
            return BigDecimal.ZERO;
        }

        return voucher.calculateDiscount(eligibleAmount);
    }

    private void recordUsage(Long voucherId, Long userId, Long orderId) {
        Voucher voucher = voucherRepository.findById(voucherId).orElse(null);
        if (voucher == null)
            return;

        VoucherUsage usage = VoucherUsage.builder()
                .voucher(voucher)
                .userId(userId)
                .orderId(orderId)
                .build();
        usageRepository.save(usage);

        voucher.setCurrentUsageCount(voucher.getCurrentUsageCount() + 1);
        voucherRepository.save(voucher);

        log.info("Recorded voucher usage: voucher={}, user={}, order={}", voucherId, userId, orderId);
    }

    private record VoucherDiscount(Voucher voucher, BigDecimal discount) {
    }
}
