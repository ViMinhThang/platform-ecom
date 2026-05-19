package com.ecom.analytics.controller;

import com.ecom.analytics.dto.BatchTrackEventDTO;
import com.ecom.analytics.dto.TrackEventDTO;
import com.ecom.analytics.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
}
