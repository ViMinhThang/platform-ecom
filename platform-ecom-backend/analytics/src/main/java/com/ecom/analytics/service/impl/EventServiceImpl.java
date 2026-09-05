package com.ecom.analytics.service.impl;

import com.ecom.analytics.dto.BatchTrackEventDTO;
import com.ecom.analytics.dto.TrackEventDTO;
import com.ecom.analytics.entity.UserEvent;
import com.ecom.analytics.repository.UserEventRepository;
import com.ecom.analytics.service.EventService;
import com.ecom.common.event.KafkaTopics;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private static final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final UserEventRepository userEventRepository;
    private final ModelMapper modelMapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public EventServiceImpl(UserEventRepository userEventRepository, ModelMapper modelMapper,
                            KafkaTemplate<String, Object> kafkaTemplate) {
        this.userEventRepository = userEventRepository;
        this.modelMapper = modelMapper;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    @Transactional
    public void trackEvent(TrackEventDTO eventDTO) {
        UserEvent event = convertToEntity(eventDTO);
        userEventRepository.save(event);

        // L2: real-time user-event stream (was recommendation-service, now L4 Streams input)
        String key = eventDTO.getUserId() != null ? String.valueOf(eventDTO.getUserId()) : "anonymous";
        kafkaTemplate.send(KafkaTopics.USER_EVENT, key, eventDTO);

        log.debug("Tracked event: {} for user: {}", event.getEventType(), event.getUserId());
    }

    @Override
    @Transactional
    public void trackBatchEvents(BatchTrackEventDTO batchDTO) {
        List<UserEvent> events = batchDTO.getEvents().stream()
                .map(dto -> {
                    if (dto.getUserId() == null) dto.setUserId(batchDTO.getUserId());
                    if (dto.getSessionId() == null) dto.setSessionId(batchDTO.getSessionId());
                    return convertToEntity(dto);
                })
                .collect(Collectors.toList());

        userEventRepository.saveAll(events);

        batchDTO.getEvents().forEach(dto -> {
            String key = dto.getUserId() != null ? String.valueOf(dto.getUserId()) : "anonymous";
            kafkaTemplate.send(KafkaTopics.USER_EVENT, key, dto);
        });

        log.debug("Tracked batch of {} events", events.size());
    }

    private UserEvent convertToEntity(TrackEventDTO dto) {
        UserEvent event = modelMapper.map(dto, UserEvent.class);
        if (dto.getTimestamp() != null) {
            event.setTimestamp(LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(dto.getTimestamp()), ZoneId.systemDefault()));
        } else {
            event.setTimestamp(LocalDateTime.now());
        }
        return event;
    }
}
