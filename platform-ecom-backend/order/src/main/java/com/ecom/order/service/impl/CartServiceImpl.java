package com.ecom.order.service.impl;

import com.ecom.common.exception.CartNotFoundException;
import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.dto.AddToCartRequest;
import com.ecom.order.dto.CartDTO;
import com.ecom.order.dto.ProductDetails;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.CartItem;
import com.ecom.order.helper.CartHelper;
import com.ecom.order.repository.CartRepository;
import com.ecom.order.service.signature.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private static final int MIN_QUANTITY = 1;

    private final CartRepository cartRepository;
    private final ModelMapper modelMapper;
    private final ProductServiceClient productServiceClient;
    private final CartHelper cartHelper;

    @Override
    @Transactional
    public CartDTO getCartForUser(Long userId) {
        Cart cart = cartHelper.getOrCreateCart(userId);
        enrichCartItems(cart);
        return convertToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO addToCart(Long userId, AddToCartRequest request) {
        Cart cart = cartHelper.getOrCreateCart(userId);
        CartItem existingItem = cartHelper.findExistingItem(cart, request.getProductId(), request.getVariantId());

        if (existingItem != null) {
            existingItem.updateQuantity(request.getQuantity());
        } else {
            addNewItemToCart(cart, request);
        }

        cart = cartRepository.save(cart);
        enrichCartItems(cart);

        log.info("Added item to cart: user={}, product={}, quantity={}",
                userId, request.getProductId(), request.getQuantity());

        return convertToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO updateCartItemQuantity(Long userId, Long productId, Long variantId, Integer quantityChange) {
        Cart cart = cartHelper.findByUserIdOrThrow(userId);
        CartItem item = cartHelper.findItemInCart(cart, productId, variantId);

        item.updateQuantity(quantityChange);

        if (item.getQuantity() < MIN_QUANTITY) {
            cart.removeItem(item);
        }

        cart = cartRepository.save(cart);
        enrichCartItems(cart);

        return convertToDTO(cart);
    }

    @Override
    @Transactional
    public void removeFromCart(Long userId, Long productId, Long variantId) {
        Cart cart = cartHelper.findByUserIdOrThrow(userId);
        CartItem item = cartHelper.findItemInCart(cart, productId, variantId);

        cart.removeItem(item);
        cartRepository.save(cart);

        log.info("Removed item from cart: user={}, product={}", userId, productId);
    }

    @Override
    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Không tìm thấy giỏ hàng"));

        cart.clearItems();
        cartRepository.save(cart);

        log.info("Cleared cart: {}", cartId);
    }

    private void addNewItemToCart(Cart cart, AddToCartRequest request) {
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

    private void enrichCartItems(Cart cart) {
        for (CartItem item : cart.getItems()) {
            enrichCartItem(item);
        }
    }

    private void enrichCartItem(CartItem item) {
        var response = productServiceClient.getProductDetails(item.getProductId(), item.getVariantId());

        if (response != null && response.isSuccess() && response.getData() != null) {
            applyProductDetails(item, response.getData());
        }
    }

    private void applyProductDetails(CartItem item, ProductDetails details) {
        item.setProductName(details.getName());
        item.setImageUrl(details.getImageUrl());
        item.setSellerId(details.getSellerId());
        item.setSellerName(details.getSellerName());

        if (item.getVariantId() != null) {
            item.setVariantName(details.getVariantName());
        }
    }

    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = modelMapper.map(cart, CartDTO.class);
        dto.setTotalAmount(calculateTotalAmount(cart));
        dto.setTotalItems(calculateTotalItems(cart));
        return dto;
    }

    private BigDecimal calculateTotalAmount(Cart cart) {
        return cart.getItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private int calculateTotalItems(Cart cart) {
        return cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}
