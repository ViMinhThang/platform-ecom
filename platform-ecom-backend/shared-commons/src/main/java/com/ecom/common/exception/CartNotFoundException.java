package com.ecom.common.exception;

/**
 * Exception thrown when a cart is not found
 */
public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(String message) {
        super(message);
    }

    public CartNotFoundException(Long cartId) {
        super("Cart not found: " + cartId);
    }
}
