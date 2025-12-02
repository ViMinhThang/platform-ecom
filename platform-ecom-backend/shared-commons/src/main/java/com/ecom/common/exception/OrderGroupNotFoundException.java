package com.ecom.common.exception;

/**
 * Exception thrown when an order group is not found
 */
public class OrderGroupNotFoundException extends RuntimeException {
    public OrderGroupNotFoundException(Long id) {
        super("Order group not found: " + id);
    }

    public OrderGroupNotFoundException(String message) {
        super(message);
    }
}
