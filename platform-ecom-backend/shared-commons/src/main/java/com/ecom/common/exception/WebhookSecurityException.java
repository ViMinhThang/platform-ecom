package com.ecom.common.exception;

/**
 * Exception thrown for webhook security violations
 */
public class WebhookSecurityException extends RuntimeException {
    public WebhookSecurityException(String message) {
        super(message);
    }
}
