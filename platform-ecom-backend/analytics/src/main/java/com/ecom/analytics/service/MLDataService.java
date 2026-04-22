package com.ecom.analytics.service;

import com.ecom.analytics.dto.MLInteractionsResponse;
import com.ecom.analytics.dto.MLTrendingResponse;

public interface MLDataService {
    MLInteractionsResponse getUserProductInteractions(Integer days);
    MLTrendingResponse getTrendingProducts(Integer days, Integer limit);
}
