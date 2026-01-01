package com.ecom.chatbot.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Wrapper DTO to handle APIResponse format from Product service.
 * Product service returns: { "success": true, "message": "...", "data": {...} }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseWrapper<T> {
    private boolean success;
    private String message;
    private T data;
}
