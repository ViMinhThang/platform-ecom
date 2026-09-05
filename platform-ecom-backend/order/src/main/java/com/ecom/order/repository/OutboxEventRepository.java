package com.ecom.order.repository;

import com.ecom.order.entity.OutboxEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

    List<OutboxEvent> findByPublishedFalseOrderByIdAsc(Pageable pageable);

    @Modifying
    @Query("DELETE FROM OutboxEvent o WHERE o.published = true AND o.publishedAt < :cutoff")
    int deletePublishedBefore(LocalDateTime cutoff);
}
