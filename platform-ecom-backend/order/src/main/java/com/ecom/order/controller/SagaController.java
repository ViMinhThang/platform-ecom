package com.ecom.order.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.order.saga.SagaState;
import com.ecom.order.saga.SagaStateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Lab read model for L08: watch sagas walk STARTED → STOCK_CONFIRMED → DONE.
 * Read-only; all transitions happen in OrderSagaOrchestrator.
 */
@RestController
@RequestMapping("/api/v1/sagas")
@RequiredArgsConstructor
public class SagaController {

    private final SagaStateRepository sagaRepository;

    @GetMapping
    public ResponseEntity<APIResponse<List<SagaState>>> all() {
        return ResponseBuilder.success("Sagas", sagaRepository.findAll());
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<APIResponse<SagaState>> one(@PathVariable String orderNumber) {
        return sagaRepository.findByOrderNumber(orderNumber)
                .map(s -> ResponseBuilder.success("Saga", s))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new APIResponse<>("Saga not found: " + orderNumber, false, null)));
    }
}
