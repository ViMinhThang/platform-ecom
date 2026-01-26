package com.ecom.analytics.service;

import com.ecom.analytics.dto.BatchTrackEventDTO;
import com.ecom.analytics.dto.TrackEventDTO;

public interface EventService {
    void trackEvent(TrackEventDTO eventDTO);
    void trackBatchEvents(BatchTrackEventDTO batchDTO);
}
