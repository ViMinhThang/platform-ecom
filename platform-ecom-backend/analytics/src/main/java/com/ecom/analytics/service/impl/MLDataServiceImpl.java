package com.ecom.analytics.service.impl;

import com.ecom.analytics.dto.MLInteractionsResponse;
import com.ecom.analytics.dto.MLTrendingResponse;
import com.ecom.analytics.dto.TrendingProductDTO;
import com.ecom.analytics.dto.UserInteractionDTO;
import com.ecom.analytics.repository.UserEventRepository;
import com.ecom.analytics.service.MLDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MLDataServiceImpl implements MLDataService {

    private final UserEventRepository userEventRepository;

    @Override
    @Transactional(readOnly = true)
    public MLInteractionsResponse getUserProductInteractions(Integer days) {
        int safeDays = days == null ? 90 : Math.max(days, 1);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime since = now.minusDays(safeDays);
        LocalDateTime recent7 = now.minusDays(7);
        LocalDateTime recent30 = now.minusDays(30);

        List<UserInteractionDTO> interactions = userEventRepository.getAggregatedInteractions(
                since,
                recent7,
                recent30
        );

        return MLInteractionsResponse.builder()
                .data(interactions)
                .totalRecords((long) interactions.size())
                .periodDays(safeDays)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MLTrendingResponse getTrendingProducts(Integer days, Integer limit) {
        int safeDays = days == null ? 30 : Math.max(days, 1);
        int requestedLimit = limit == null ? 200 : limit;
        int safeLimit = Math.max(1, Math.min(requestedLimit, 1000));
        LocalDateTime since = LocalDateTime.now().minusDays(safeDays);

        List<TrendingProductDTO> trending = userEventRepository.getTrendingProducts(
                since,
                PageRequest.of(0, safeLimit)
        );

        return MLTrendingResponse.builder()
                .data(trending)
                .totalRecords((long) trending.size())
                .periodDays(safeDays)
                .build();
    }
}
