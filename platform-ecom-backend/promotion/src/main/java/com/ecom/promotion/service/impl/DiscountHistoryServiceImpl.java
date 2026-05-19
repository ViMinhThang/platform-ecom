package com.ecom.promotion.service.impl;

import com.ecom.promotion.dto.DiscountHistoryDTO;
import com.ecom.promotion.helper.DiscountHistoryHelper;
import com.ecom.promotion.repository.DiscountHistoryRepository;
import com.ecom.promotion.service.signature.DiscountHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DiscountHistoryServiceImpl implements DiscountHistoryService {

    private final DiscountHistoryRepository discountHistoryRepository;
    private final DiscountHistoryHelper discountHistoryHelper;

    @Override
    @Transactional(readOnly = true)
    public List<DiscountHistoryDTO> getProductDiscountHistory(Long productId) {
        return discountHistoryRepository.findByProductIdOrderByStartTimeDesc(productId)
                .stream()
                .map(discountHistoryHelper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DiscountHistoryDTO getBestDiscountForProduct(Long productId) {
        return discountHistoryRepository.findBestDiscountForProduct(productId, PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .map(discountHistoryHelper::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiscountHistoryDTO> getRecentDiscounts(Long productId, int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return discountHistoryRepository.findRecentDiscountsForProduct(productId, since)
                .stream()
                .map(discountHistoryHelper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiscountHistoryDTO> getTopDiscountedProducts(int limit) {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        return discountHistoryRepository.findTopDiscountsInPeriod(since, PageRequest.of(0, limit))
                .stream()
                .map(discountHistoryHelper::toDTO)
                .toList();
    }
}
