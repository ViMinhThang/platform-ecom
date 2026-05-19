package com.ecom.analytics.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BatchTrackEventDTO {
    
    @NotEmpty(message = "Events list cannot be empty")
    @Valid
    private List<TrackEventDTO> events;
    
    private String sessionId;
    private Long userId;

    public List<TrackEventDTO> getEvents() { return events; }
    public void setEvents(List<TrackEventDTO> events) { this.events = events; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
