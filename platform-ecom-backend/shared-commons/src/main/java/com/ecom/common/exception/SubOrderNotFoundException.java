package com.ecom.common.exception;

/**
 * Exception thrown when a sub-order is not found
 */
public class SubOrderNotFoundException extends RuntimeException {
    public SubOrderNotFoundException(Long id) {
        super("Sub-order not found: " + id);
    }

    public SubOrderNotFoundException(String message) {
        super(message);
    }
}
