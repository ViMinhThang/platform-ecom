package com.ecom.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base exception for API-related errors.
 * Provides support for HTTP status codes and error codes.
 */
@Getter
public class APIException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final HttpStatus status;
    private final String errorCode;

    public APIException() {
        this(HttpStatus.INTERNAL_SERVER_ERROR, null, null);
    }

    public APIException(String message) {
        this(HttpStatus.INTERNAL_SERVER_ERROR, message, null);
    }

    public APIException(HttpStatus status, String message) {
        this(status, message, null);
    }

    public APIException(HttpStatus status, String message, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public APIException(String message, Throwable cause) {
        super(message, cause);
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
        this.errorCode = null;
    }
}
