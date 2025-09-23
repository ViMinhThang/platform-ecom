package com.ecom.order.service;

import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.dtos.CartDTO;
import com.ecom.order.dtos.CartItemDTO;
import com.ecom.order.dtos.ProductDTO;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.CartItem;
import com.ecom.order.exception.APIException;
import com.ecom.order.exception.ResourceNotFoundException;
import com.ecom.order.repositories.CartItemRepository;
import com.ecom.order.repositories.CartRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;


    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ProductServiceClient productServiceClient;

    private Cart createCart(Long userId) {
        Cart userCart = cartRepository.findByUserId(userId);
        if (userCart != null) {
            return userCart;
        }

        Cart cart = new Cart();
        cart.setTotalPrice(0.00);
        cart.setUserId(userId);
        Cart newCart = cartRepository.save(cart);

        return newCart;
    }


    @Transactional
    @Override
    public String createOrUpdateCartWithItems(List<CartItemDTO> cartItems, Long userId) {
        Cart existingCart = cartRepository.findByUserId(userId);
        if (existingCart == null) {
            existingCart = new Cart();
            existingCart.setTotalPrice(0.00);
            existingCart.setUserId(userId);
            existingCart = cartRepository.save(existingCart);
        } else {
            cartItemRepository.deleteAllByCartId(existingCart.getCartId());
        }

        double totalPrice = 0.00;

        for (CartItemDTO cartItemDTO : cartItems) {
            Long productId = cartItemDTO.getProductId();
            Integer quantity = cartItemDTO.getQuantity();

            ProductDTO product = productServiceClient.getProductById(productId)
                    .getBody();
            if (product == null) {
                throw new ResourceNotFoundException("Product", "productId", productId);
            }

            totalPrice += product.getSpecialPrice() * quantity;

            CartItem cartItem = new CartItem();
            cartItem.setProductId(productId);
            cartItem.setCart(existingCart);
            cartItem.setQuantity(quantity);
            cartItem.setProductPrice(product.getSpecialPrice());
            cartItem.setDiscount(product.getDiscount());
            cartItemRepository.save(cartItem);
        }

        existingCart.setTotalPrice(totalPrice);
        cartRepository.save(existingCart);
        return "Cart created/updated with the new items successfully";
    }


    @Override
    public CartDTO addProductToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = createCart(userId);

        ProductDTO product = productServiceClient.getProductById(productId).getBody();

        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), productId);

        if (cartItem != null) {
            throw new APIException("Product " + product.getProductName() + " already exists in the cart");
        }

        if (product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + " is not available");
        }

        if (product.getQuantity() < quantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity " + product.getQuantity() + ".");
        }

        CartItem newCartItem = new CartItem();

        newCartItem.setProductId(productId);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(product.getSpecialPrice());

        cartItemRepository.save(newCartItem);

        product.setQuantity(product.getQuantity());

        cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));

        cartRepository.save(cart);

        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

        List<CartItem> cartItems = cart.getCartItems();

        Stream<ProductDTO> productStream = cartItems.stream().map(item -> {
            ProductDTO map = productServiceClient.getProductById(item.getProductId()).getBody();
            map.setQuantity(item.getQuantity());
            return map;
        });

        cartDTO.setProducts(productStream.toList());

        return cartDTO;
    }

    @Override
    public List<CartDTO> getAllCarts() {
        return List.of();
    }

    @Override
    public CartDTO updateProductQuantityInCart(Long productId, int delete) {
        return null;
    }

    @Transactional
    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

        if (cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }

        cart.setTotalPrice(cart.getTotalPrice() -
                (cartItem.getProductPrice() * cartItem.getQuantity()));

        cartItemRepository.deleteCartItemByProductIdAndCartId(cartId, productId);

        ProductDTO productDTO = productServiceClient.getProductById(productId).getBody();
        return "Product " + productDTO.getProductName() + " removed from the cart !!!";
    }

    @Override
    public CartDTO getCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "Cart Id", cartId));
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO> products = cart.getCartItems().stream()
                .map(ci -> {
                    ProductDTO productDTO = productServiceClient.getProductById(ci.getProductId()).getBody();
                    productDTO.setQuantity(ci.getQuantity());
                    return productDTO;
                })
                .toList();
        cartDTO.setProducts(products);
        return cartDTO;
    }

}
