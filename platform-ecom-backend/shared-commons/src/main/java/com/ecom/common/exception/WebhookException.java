package com.ecom.common.exception;

/**
 * Exception thrown when webhook processing fails
 */
public class WebhookException extends RuntimeException {
    public WebhookException(String message) {
        super(message);
    }

    public WebhookException(String message, Throwable cause) {
        super(message, cause);
    }
}
