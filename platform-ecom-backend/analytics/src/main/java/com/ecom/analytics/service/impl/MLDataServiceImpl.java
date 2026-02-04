package com.ecom.analytics.service.impl;

import com.ecom.analytics.dto.MLInteractionsResponse;
import com.ecom.analytics.dto.UserInteractionDTO;
import com.ecom.analytics.repository.UserEventRepository;
import com.ecom.analytics.service.MLDataService;
import lombok.RequiredArgsConstructor;
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
        LocalDateTime since = LocalDateTime.now().minusDays(days);

        List<UserInteractionDTO> interactions = userEventRepository.getAggregatedInteractions(since);

        return MLInteractionsResponse.builder()
                .data(interactions)
                .totalRecords((long) interactions.size())
                .periodDays(days)
                .build();
    }
}
