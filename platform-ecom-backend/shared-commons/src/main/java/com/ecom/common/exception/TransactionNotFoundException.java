package com.ecom.common.exception;

/**
 * Exception thrown when a payment transaction is not found
 */
public class TransactionNotFoundException extends RuntimeException {
    public TransactionNotFoundException(String id) {
        super("Transaction not found: " + id);
    }

    public TransactionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
