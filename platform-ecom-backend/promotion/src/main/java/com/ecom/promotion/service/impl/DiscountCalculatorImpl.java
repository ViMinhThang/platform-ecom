package com.ecom.promotion.service.impl;

import com.ecom.promotion.dto.CartItemDTO;
import com.ecom.promotion.dto.DiscountResult;

import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.entity.VoucherUsage;
import com.ecom.promotion.helper.VoucherHelper;
import com.ecom.promotion.repository.VoucherRepository;
import com.ecom.promotion.repository.VoucherUsageRepository;
import com.ecom.promotion.enums.VoucherCategory;
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
            String voucherCode,
            Long userId) {

        BigDecimal itemsTotal = voucherHelper.calculateItemsTotal(items);

        // Get all applicable vouchers
        List<Voucher> applicableVouchers = findApplicableVouchers(items, voucherCode, userId);

        // Separate by category
        List<Voucher> productVouchers = filterByCategory(applicableVouchers, VoucherCategory.PRODUCT);
        List<Voucher> shippingVouchers = filterByCategory(applicableVouchers, VoucherCategory.SHIPPING);

        // Select best from each category
        VoucherDiscount bestProduct = selectBestProductDiscount(productVouchers, items, itemsTotal);
        VoucherDiscount bestShipping = selectBestShippingDiscount(shippingVouchers, shippingFee);

        // Build result
        BigDecimal totalDiscount = bestProduct.discount.add(bestShipping.discount);
        BigDecimal finalTotal = itemsTotal.add(shippingFee).subtract(totalDiscount);

        DiscountResult result = DiscountResult.builder()
                .originalTotal(itemsTotal.add(shippingFee))
                .productDiscount(bestProduct.discount)
                .shippingDiscount(bestShipping.discount)
                .totalDiscount(totalDiscount)
                .finalTotal(finalTotal.max(BigDecimal.ZERO))
                .appliedProductVoucher(voucherMapper.toDTO(bestProduct.voucher))
                .appliedShippingVoucher(voucherMapper.toDTO(bestShipping.voucher))
                .build();

        // Add warnings for rejected vouchers
        addStackingWarnings(result, productVouchers, shippingVouchers);

        return result;
    }

    @Override
    @Transactional
    public DiscountResult applyVouchers(
            Long orderId,
            List<CartItemDTO> items,
            BigDecimal shippingFee,
            String voucherCode,
            Long userId) {

        DiscountResult result = calculateDiscount(items, shippingFee, voucherCode, userId);

        // Record usage for applied vouchers
        if (result.getAppliedProductVoucher() != null) {
            recordUsage(result.getAppliedProductVoucher().getId(), userId, orderId);
        }

        if (result.getAppliedShippingVoucher() != null) {
            recordUsage(result.getAppliedShippingVoucher().getId(), userId, orderId);
        }

        return result;
    }

    private List<Voucher> findApplicableVouchers(List<CartItemDTO> items, String voucherCode, Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = new ArrayList<>();

        // Get auto-apply vouchers
        vouchers.addAll(voucherRepository.findActiveAutoApplyVouchers(now));

        // Add code voucher if provided
        if (voucherCode != null && !voucherCode.isBlank()) {
            voucherRepository.findByCodeAndStatus(voucherCode, VoucherStatus.ACTIVE)
                    .filter(v -> v.isActiveNow() && voucherHelper.canUserUseVoucher(v, userId))
                    .ifPresent(vouchers::add);
        }

        // Filter by scope and min order amount
        BigDecimal itemsTotal = voucherHelper.calculateItemsTotal(items);
        return vouchers.stream()
                .filter(v -> voucherHelper.matchesMinOrderAmount(v, itemsTotal))
                .filter(v -> voucherHelper.matchesScope(v, items))
                .filter(v -> voucherHelper.canUserUseVoucher(v, userId))
                .distinct()
                .collect(Collectors.toList());
    }

    private List<Voucher> filterByCategory(List<Voucher> vouchers, VoucherCategory category) {
        return vouchers.stream()
                .filter(v -> v.getCategory() == category)
                .collect(Collectors.toList());
    }

    private VoucherDiscount selectBestProductDiscount(List<Voucher> vouchers, List<CartItemDTO> items,
            BigDecimal total) {
        Voucher best = null;
        BigDecimal bestDiscount = BigDecimal.ZERO;

        for (Voucher voucher : vouchers) {
            BigDecimal discount = voucher.calculateDiscount(total);
            if (discount.compareTo(bestDiscount) > 0) {
                bestDiscount = discount;
                best = voucher;
            }
        }

        return new VoucherDiscount(best, bestDiscount);
    }

    private VoucherDiscount selectBestShippingDiscount(List<Voucher> vouchers, BigDecimal shippingFee) {
        Voucher best = null;
        BigDecimal bestDiscount = BigDecimal.ZERO;

        for (Voucher voucher : vouchers) {
            BigDecimal discount = voucher.calculateDiscount(shippingFee);
            if (discount.compareTo(bestDiscount) > 0) {
                bestDiscount = discount;
                best = voucher;
            }
        }

        return new VoucherDiscount(best, bestDiscount);
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

    private void addStackingWarnings(DiscountResult result, List<Voucher> productVouchers,
            List<Voucher> shippingVouchers) {
        if (productVouchers.size() > 1) {
            result.addWarning("Multiple product vouchers found - only the best discount was applied");
        }
        if (shippingVouchers.size() > 1) {
            result.addWarning("Multiple shipping vouchers found - only the best discount was applied");
        }
    }

    private record VoucherDiscount(Voucher voucher, BigDecimal discount) {
    }
}
