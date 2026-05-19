package com.ecom.order.service.signature;

import com.ecom.order.dto.AddToCartRequest;
import com.ecom.order.dto.CartDTO;

/**
 * Cart Service Interface
 */
public interface CartService {

    CartDTO getCartForUser(Long userId);

    CartDTO addToCart(Long userId, AddToCartRequest request);

    CartDTO updateCartItemQuantity(Long userId, Long productId, Long variantId, Integer quantityChange);

    void removeFromCart(Long userId, Long productId, Long variantId);

    void clearCart(Long cartId);
}
