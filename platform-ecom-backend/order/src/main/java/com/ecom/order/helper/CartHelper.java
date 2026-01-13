package com.ecom.order.helper;

import com.ecom.common.exception.CartItemNotFoundException;
import com.ecom.common.exception.CartNotFoundException;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.CartItem;
import com.ecom.order.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class CartHelper {

        private final CartRepository cartRepository;
        private static final int CART_EXPIRY_DAYS = 30;

        public Cart getOrCreateCart(Long userId) {
                return cartRepository.findByUserIdWithItems(userId)
                                .orElseGet(() -> createNewCart(userId));
        }

        public Cart findByUserIdOrThrow(Long userId) {
                return cartRepository.findByUserIdWithItems(userId)
                                .orElseThrow(() -> new CartNotFoundException("Cart not found for user: " + userId));
        }

        public Cart createNewCart(Long userId) {
                Cart cart = Cart.builder()
                                .userId(userId)
                                .expiresAt(LocalDateTime.now().plusDays(CART_EXPIRY_DAYS))
                                .build();
                return cartRepository.save(cart);
        }

        public CartItem findItemInCart(Cart cart, Long productId, Long variantId) {
                return cart.getItems().stream()
                                .filter(item -> item.getProductId().equals(productId) &&
                                                (variantId == null || item.getVariantId().equals(variantId)))
                                .findFirst()
                                .orElseThrow(() -> new CartItemNotFoundException("Item not found in cart"));
        }

        public CartItem findExistingItem(Cart cart, Long productId, Long variantId) {
                return cart.getItems().stream()
                                .filter(item -> item.getProductId().equals(productId) &&
                                                (variantId == null || item.getVariantId().equals(variantId)))
                                .findFirst()
                                .orElse(null);
        }

        public void clearCart(Cart cart) {
                cart.clearItems();
                cartRepository.save(cart);
        }
}
