package com.ecom.order.saga;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SagaStateRepository extends JpaRepository<SagaState, Long> {

    Optional<SagaState> findByOrderNumber(String orderNumber);
}
