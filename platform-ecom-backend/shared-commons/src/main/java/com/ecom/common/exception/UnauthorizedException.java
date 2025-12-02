package com.ecom.common.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends APIException{

    public UnauthorizedException(String message) {
        super(HttpStatus.FORBIDDEN, message, "RESOURCE_FORBIDDEN");
    }
}
