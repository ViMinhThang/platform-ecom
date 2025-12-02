package com.ecom.common.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends APIException{
    public DuplicateResourceException(String resourceName, String fieldName) {
        super(
                HttpStatus.BAD_REQUEST,
                String.format("%s: %s is already exist in database'", resourceName, fieldName),
                "RESOURCE_DUPLICATE"
        );
    }

    public DuplicateResourceException(String message) {
        super(HttpStatus.BAD_REQUEST, message, "RESOURCE_DUPLICATE");
    }
}
