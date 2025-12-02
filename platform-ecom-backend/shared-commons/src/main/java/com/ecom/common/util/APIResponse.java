package com.ecom.common.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard API response wrapper.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class APIResponse<T> {
    private String message;
    private boolean success;
    private T data;
}
