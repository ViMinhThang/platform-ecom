package com.ecom.analytics.repository;

import com.ecom.analytics.entity.UserEvent;
import com.ecom.analytics.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserEventRepository extends JpaRepository<UserEvent, Long> {
    List<UserEvent> findByUserId(Long userId);
    List<UserEvent> findBySessionId(String sessionId);
    List<UserEvent> findByProductId(Long productId);
    List<UserEvent> findBySellerId(Long sellerId);
    List<UserEvent> findByEventTypeAndTimestampAfter(EventType eventType, LocalDateTime timestamp);
}
