package com.ecom.order.saga;

/**
 * L08: explicit saga state. Choreography (L03) keeps this in participants'
 * heads; the orchestrator writes it down where you can query it.
 */
public enum SagaStatus {
    STARTED,
    STOCK_CONFIRMED,
    DONE,
    FAILED
}
