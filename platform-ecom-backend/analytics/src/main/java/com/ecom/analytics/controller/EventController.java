package com.ecom.analytics.controller;

import com.ecom.analytics.dto.BatchTrackEventDTO;
import com.ecom.analytics.dto.TrackEventDTO;
import com.ecom.analytics.service.EventService;
import io.github.resilience4j.bulkhead.BulkheadFullException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Void> trackEvent(@Valid @RequestBody TrackEventDTO eventDTO) {
        eventService.trackEvent(eventDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> trackBatchEvents(@Valid @RequestBody BatchTrackEventDTO batchDTO) {
        eventService.trackBatchEvents(batchDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * L06: shed load signals 429, not 500 — the caller (not us) decides
     * whether to retry later.
     */
    @ExceptionHandler(BulkheadFullException.class)
    public ResponseEntity<Void> onBulkheadFull() {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }
}
