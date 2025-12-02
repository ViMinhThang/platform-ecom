package com.ecom.order.controller;

import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.order.dtos.CartDTO;
import com.ecom.order.dtos.CartItemDTO;
import com.ecom.order.dtos.ProductDTO;
import com.ecom.order.entity.Cart;
import com.ecom.order.repositories.CartRepository;
import com.ecom.order.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartRepository cartRepository;

    private final AuthContext authContext;

    private final CartService cartService;

    @PostMapping("/create")
    public ResponseEntity<APIResponse<String>> createOrUpdateCart(@RequestBody List<CartItemDTO> cartItems,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        String response = cartService.createOrUpdateCartWithItems(cartItems, userId);
        return ResponseBuilder.createdWithMessage("Cart created or updated successfully", response);
    }

    @PostMapping("/add")
    public ResponseEntity<APIResponse<CartDTO>> addItemToCart(@RequestBody CartItemDTO cartItemDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        CartDTO cartDTO = cartService.addItemToCart(userId, cartItemDTO);
        return ResponseBuilder.createdWithMessage("Product added to cart successfully", cartDTO);
    }

    @GetMapping("/")
    public ResponseEntity<APIResponse<List<CartDTO>>> getCarts() {
        List<CartDTO> cartDTOs = cartService.getAllCarts();
        return ResponseBuilder.success("Carts retrieved successfully", cartDTOs);
    }

    @GetMapping("/users/cart")
    public ResponseEntity<APIResponse<CartDTO>> getCartById(HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
             // Return empty cart or create one?
             // For now, let's return a not found or empty.
             // But getCart handles creation if needed? No, getCart throws if not found.
             // Let's return empty if not found or create it.
             // cartService.createCart is private.
             // But we can just return success with empty DTO or null.
             return ResponseBuilder.success("Cart retrieved successfully", new CartDTO());
        }
        Long cartId = cart.getCartId();
        CartDTO cartDTO = cartService.getCart(cartId);
        return ResponseBuilder.success("Cart retrieved successfully", cartDTO);
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<APIResponse<CartDTO>> updateCartItem(@PathVariable Long productId,
            @RequestParam(required = false) Long variantId,
            @RequestParam int quantityChange,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        Cart cart = cartRepository.findByUserId(userId);
        CartDTO cartDTO = cartService.updateItemQuantity(cart.getCartId(), productId, variantId, quantityChange);
        return ResponseBuilder.success("Cart product updated successfully", cartDTO);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<APIResponse<String>> deleteItemFromCart(@PathVariable Long productId,
            @RequestParam(required = false) Long variantId,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        Cart cart = cartRepository.findByUserId(userId);
        String status = cartService.deleteItemFromCart(cart.getCartId(), productId, variantId);
        return ResponseBuilder.success("Product deleted from cart successfully", status);
    }

    @PostMapping("/update-product-in-carts")
    public ResponseEntity<APIResponse<String>> updateProductInCarts(@RequestBody ProductDTO productDTO) {
        String status = cartService.updateProductInCarts(productDTO);
        return ResponseBuilder.success("Product updated in carts successfully", status);
    }

    @PostMapping("delete-product-from-carts")
    public ResponseEntity<APIResponse<String>> deleteProductFromCarts(@RequestBody ProductDTO productDTO) {
        String status = cartService.deleteProductFromCarts(productDTO);
        return ResponseBuilder.success("Product deleted from carts successfully", status);
    }
}
