package com.ecom.order.service;

import com.ecom.order.dtos.CartDTO;
import com.ecom.order.dtos.CartItemDTO;
import com.ecom.order.entity.Cart;

import java.util.List;

public interface CartService {

    String createOrUpdateCartWithItems(List<CartItemDTO> cartItems,Long userId);

    CartDTO addProductToCart(Long userId,Long productId, Integer quantity);

    List<CartDTO> getAllCarts();

    CartDTO updateProductQuantityInCart(Long productId, int delete);

    String deleteProductFromCart(Long cartId, Long productId);

    CartDTO getCart(Long cartId);
}
