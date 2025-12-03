package com.ecom.order.controller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.order.dto.AddToCartRequest;
import com.ecom.order.dto.CartDTO;
import com.ecom.order.service.signature.CartService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Cart Controller - Shopping cart operations
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    private final AuthContext authContext;

    /**
     * Get user's cart (grouped by seller)
     */
    @GetMapping()
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<CartDTO>> getCart(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        CartDTO cart = cartService.getCartForUser(userId);

        return ResponseBuilder.success("Cart retrieved", cart);
    }

    /**
     * Add item to cart
     */
    @PostMapping("/add")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<CartDTO>> addToCart(
            @Valid @RequestBody AddToCartRequest addRequest,
            HttpServletRequest request) {

        Long userId = authContext.getUserId(request);
        CartDTO cart = cartService.addToCart(userId, addRequest);

        log.info("User {} added product {} to cart", userId, addRequest.getProductId());
        return ResponseBuilder.success("Item added to cart", cart);
    }

    /**
     * Update cart item quantity
     */
    @PutMapping("/items/{productId}")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<CartDTO>> updateCartItem(
            @PathVariable Long productId,
            @RequestParam(required = false) Long variantId,
            @RequestParam Integer quantityChange,
            HttpServletRequest request) {

        Long userId = authContext.getUserId(request);
        CartDTO cart = cartService.updateCartItemQuantity(userId, productId, variantId, quantityChange);

        return ResponseBuilder.success("Cart updated", cart);
    }

    /**
     * Remove item from cart
     */
    @DeleteMapping("/items/{productId}")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<Void>> removeFromCart(
            @PathVariable Long productId,
            @RequestParam(required = false) Long variantId,
            HttpServletRequest request) {

        Long userId = authContext.getUserId(request);
        cartService.removeFromCart(userId, productId, variantId);

        return ResponseBuilder.success("Item removed from cart", null);
    }

    /**
     * Clear entire cart
     */
    @DeleteMapping("/clear")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<Void>> clearCart(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        // Get cart first
        CartDTO cart = cartService.getCartForUser(userId);
        cartService.clearCart(cart.getId());

        return ResponseBuilder.success("Cart cleared", null);
    }
}
