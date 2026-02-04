package com.ecom.analytics.repository;

import com.ecom.analytics.dto.UserInteractionDTO;
import com.ecom.analytics.entity.UserEvent;
import com.ecom.analytics.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
        SELECT new com.ecom.analytics.dto.UserInteractionDTO(
            e.userId,
            e.productId,
            CAST(SUM(CASE 
                WHEN e.eventType = 'PURCHASE' THEN 5
                WHEN e.eventType = 'ADD_TO_CART' THEN 3
                WHEN e.eventType = 'PRODUCT_VIEW' THEN 1
                ELSE 0
            END) AS int)
        )
        FROM UserEvent e
        WHERE e.userId IS NOT NULL 
          AND e.productId IS NOT NULL
          AND e.timestamp > :since
        GROUP BY e.userId, e.productId
        HAVING SUM(CASE 
            WHEN e.eventType = 'PURCHASE' THEN 5
            WHEN e.eventType = 'ADD_TO_CART' THEN 3
            WHEN e.eventType = 'PRODUCT_VIEW' THEN 1
            ELSE 0
        END) > 0
        """)
    List<UserInteractionDTO> getAggregatedInteractions(@Param("since") LocalDateTime since);
}
