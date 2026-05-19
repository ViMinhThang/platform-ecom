package com.ecom.common.exception;

/**
 * Exception thrown when a duplicate payment is detected
 */
public class DuplicatePaymentException extends RuntimeException {
    public DuplicatePaymentException(String message) {
        super(message);
    }
}
