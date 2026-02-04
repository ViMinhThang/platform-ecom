package com.ecom.analytics.service;

import com.ecom.analytics.dto.MLInteractionsResponse;

public interface MLDataService {
    MLInteractionsResponse getUserProductInteractions(Integer days);
}
