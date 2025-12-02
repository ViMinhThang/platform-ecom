package com.ecom.common.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Utility class for building consistent ResponseEntity objects.
 * Reduces boilerplate code in controllers.
 */
public class ResponseBuilder {

    private ResponseBuilder() {
        // Utility class - prevent instantiation
    }

    public static <T> ResponseEntity<T> ok(T body) {
        return ResponseEntity.ok(body);
    }

    public static <T> ResponseEntity<T> created(T body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    public static <T> ResponseEntity<T> accepted(T body) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(body);
    }

    public static <T> ResponseEntity<T> noContent() {
        return ResponseEntity.noContent().build();
    }

    public static <T> ResponseEntity<APIResponse<T>> success(String message, T data) {
        APIResponse<T> response = new APIResponse<T>(message, true, data);
        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<APIResponse<T>> createdWithMessage(String message, T data) {
        APIResponse<T> response = new APIResponse<T>(message, true, data);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public static <T> ResponseEntity<APIResponse<T>> deleted(String message, T data) {
        APIResponse<T> response = new APIResponse<T>(message, true, data);
        return ResponseEntity.ok(response);
    }
}
