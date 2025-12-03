package com.ecom.order.service.impl;

import com.ecom.common.exception.CartItemNotFoundException;
import com.ecom.common.exception.CartNotFoundException;
import com.ecom.order.dto.CartDTO;
import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.dto.AddToCartRequest;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.CartItem;
import com.ecom.order.service.signature.CartService;
import com.ecom.order.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

        private final CartRepository cartRepository;
        private final ModelMapper modelMapper;
        private final ProductServiceClient productServiceClient;

        /**
         * Get or create cart for user
         */
        @Transactional
        public CartDTO getCartForUser(Long userId) {
                Cart cart = cartRepository.findByUserIdWithItems(userId)
                                .orElseGet(() -> createCart(userId));

                // Enrich cart items with product details
                enrichCartItems(cart);

                return convertToDTO(cart);
        }

        /**
         * Add item to cart
         */
        @Transactional
        public CartDTO addToCart(Long userId, AddToCartRequest request) {
                Cart cart = cartRepository.findByUserId(userId)
                                .orElseGet(() -> createCart(userId));

                CartItem existingItem = cart.getItems().stream()
                                .filter(item -> item.getProductId().equals(request.getProductId()) &&
                                                (request.getVariantId() == null
                                                                || item.getVariantId().equals(request.getVariantId())))
                                .findFirst()
                                .orElse(null);

                if (existingItem != null) {
                        existingItem.updateQuantity(request.getQuantity());
                } else {
                        BigDecimal price = productServiceClient.getProductPrice(
                                        request.getProductId(), request.getVariantId());

                        CartItem newItem = CartItem.builder()
                                        .productId(request.getProductId())
                                        .variantId(request.getVariantId())
                                        .quantity(request.getQuantity())
                                        .price(price)
                                        .build();

                        cart.addItem(newItem);
                }

                cart = cartRepository.save(cart);
                enrichCartItems(cart);

                log.info("Added item to cart for user {}: product={}, quantity={}",
                                userId, request.getProductId(), request.getQuantity());

                return convertToDTO(cart);
        }

        /**
         * Update cart item quantity
         */
        @Transactional
        public CartDTO updateCartItemQuantity(Long userId, Long productId, Long variantId, Integer quantityChange) {
                Cart cart = cartRepository.findByUserIdWithItems(userId)
                                .orElseThrow(() -> new CartNotFoundException("Cart not found for user: " + userId));

                CartItem item = cart.getItems().stream()
                                .filter(i -> i.getProductId().equals(productId) &&
                                                (variantId == null || i.getVariantId().equals(variantId)))
                                .findFirst()
                                .orElseThrow(() -> new CartItemNotFoundException("Item not found in cart"));

                item.updateQuantity(quantityChange);

                // Remove item if quantity becomes 0 or negative
                if (item.getQuantity() < 1) {
                        cart.removeItem(item);
                }

                cart = cartRepository.save(cart);
                enrichCartItems(cart);

                return convertToDTO(cart);
        }

        /**
         * Remove item from cart
         */
        @Transactional
        public void removeFromCart(Long userId, Long productId, Long variantId) {
                Cart cart = cartRepository.findByUserIdWithItems(userId)
                                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

                CartItem item = cart.getItems().stream()
                                .filter(i -> i.getProductId().equals(productId) &&
                                                (variantId == null || i.getVariantId().equals(variantId)))
                                .findFirst()
                                .orElseThrow(() -> new CartItemNotFoundException("Item not found"));

                cart.removeItem(item);
                cartRepository.save(cart);

                log.info("Removed item from cart: user={}, product={}", userId, productId);
        }

        /**
         * Clear cart
         */
        @Transactional
        public void clearCart(Long cartId) {
                Cart cart = cartRepository.findById(cartId)
                                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

                cart.clearItems();
                cartRepository.save(cart);

                log.info("Cleared cart: {}", cartId);
        }

        /**
         * Create new cart
         */
        private Cart createCart(Long userId) {
                Cart cart = Cart.builder()
                                .userId(userId)
                                .expiresAt(LocalDateTime.now().plusDays(30))
                                .build();

                return cartRepository.save(cart);
        }

        /**
         * Enrich cart items with product details from product service
         */
        private void enrichCartItems(Cart cart) {
                for (CartItem item : cart.getItems()) {
                        var response = productServiceClient.getProductDetails(
                                        item.getProductId(), item.getVariantId());

                        if (response != null && response.isSuccess() && response.getData() != null) {
                                var productDetails = response.getData();
                                item.setProductName(productDetails.getName());
                                item.setImageUrl(productDetails.getImageUrl());
                                item.setSellerId(productDetails.getSellerId());
                                item.setSellerName(productDetails.getSellerName());

                                if (item.getVariantId() != null) {
                                        item.setVariantName(productDetails.getVariantName());
                                }
                        }
                }
        }

        /**
         * Convert cart to DTO
         */
        private CartDTO convertToDTO(Cart cart) {
                CartDTO dto = modelMapper.map(cart, CartDTO.class);

                // Calculate totals
                BigDecimal totalAmount = cart.getItems().stream()
                                .map(CartItem::getTotalPrice)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                int totalItems = cart.getItems().stream()
                                .mapToInt(CartItem::getQuantity)
                                .sum();

                dto.setTotalAmount(totalAmount);
                dto.setTotalItems(totalItems);

                return dto;
        }
}
