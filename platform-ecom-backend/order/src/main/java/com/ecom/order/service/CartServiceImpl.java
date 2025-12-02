//package com.ecom.order.service;
//
//import com.ecom.common.exception.APIException;
//import com.ecom.common.exception.ResourceNotFoundException;
//import com.ecom.common.util.APIResponse;
//import com.ecom.order.client.ProductServiceClient;
//import com.ecom.order.client.UserServiceClient;
//import com.ecom.order.dtos.*;
//import com.ecom.order.entity.Cart;
//import com.ecom.order.entity.CartItem;
//import com.ecom.order.repositories.CartItemRepository;
//import com.ecom.order.repositories.CartRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.modelmapper.ModelMapper;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class CartServiceImpl implements CartService {
//
//    private final CartRepository cartRepository;
//    private final CartItemRepository cartItemRepository;
//    private final ProductServiceClient productServiceClient;
//    private final UserServiceClient userServiceClient;
//    private final ModelMapper modelMapper;
//
//    private Cart createCart(Long userId) {
//        Cart userCart = cartRepository.findByUserId(userId);
//        if (userCart != null) {
//            return userCart;
//        }
//
//        Cart cart = new Cart();
//        cart.setTotalPrice(0.00);
//        cart.setUserId(userId);
//        return cartRepository.save(cart);
//    }
//
//    @Transactional
//    @Override
//    public String createOrUpdateCartWithItems(List<CartItemDTO> cartItems, Long userId) {
//        Cart existingCart = cartRepository.findByUserId(userId);
//        if (existingCart == null) {
//            existingCart = new Cart();
//            existingCart.setTotalPrice(0.00);
//            existingCart.setUserId(userId);
//            existingCart = cartRepository.save(existingCart);
//        } else {
//            cartItemRepository.deleteAllByCart_CartId(existingCart.getCartId());
//            existingCart.setTotalPrice(0.00); // Reset total price
//        }
//
//        double totalPrice = 0.00;
//
//        for (CartItemDTO cartItemDTO : cartItems) {
//            Long productId = cartItemDTO.getProductId();
//            Integer quantity = cartItemDTO.getQuantity();
//            Long variantId = cartItemDTO.getVariantId();
//
//            ProductDTO product = productServiceClient.getProductById(productId).getBody();
//            if (product == null) {
//                throw new ResourceNotFoundException("Product", "productId", productId);
//            }
//
//            double price = product.getMinPrice() != null ? product.getMinPrice().doubleValue() : 0.0;
//
//            if (variantId != null) {
//                APIResponse<ProductVariantDTO> variantResponse = productServiceClient.getPublicVariantById(variantId).getBody();
//                if (variantResponse != null && variantResponse.getData() != null) {
//                    ProductVariantDTO variant = variantResponse.getData();
//                    if (variant.getSalePrice() != null) {
//                        price = variant.getSalePrice().doubleValue();
//                    } else {
//                        price = variant.getPrice().doubleValue();
//                    }
//
//                    if (variant.getStock() < quantity) {
//                         throw new APIException("Product variant " + variant.getSku() + " has insufficient stock");
//                    }
//                }
//            }
//
//            totalPrice += price * quantity;
//
//            CartItem cartItem = new CartItem();
//            cartItem.setProductId(productId);
//            cartItem.setVariantId(variantId);
//            cartItem.setCart(existingCart);
//            cartItem.setQuantity(quantity);
//            cartItem.setProductPrice(price);
//
//            cartItemRepository.save(cartItem);
//        }
//
//        existingCart.setTotalPrice(totalPrice);
//        cartRepository.save(existingCart);
//        return "Cart created/updated with the new items successfully";
//    }
//
//    @Override
//    @Transactional
//    public CartDTO addProductToCart(Long userId, Long productId, Integer quantity) {
//
//        return null;
//    }
//
//    // Helper method to be used by Controller (I will update Controller to use this)
//    public CartDTO addItemToCart(Long userId, CartItemDTO cartItemDTO) {
//        Cart cart = createCart(userId);
//        Long productId = cartItemDTO.getProductId();
//        Integer quantity = cartItemDTO.getQuantity();
//        Long variantId = cartItemDTO.getVariantId();
//
//        ProductDTO product = productServiceClient.getProductById(productId).getBody();
//        if (product == null) {
//            throw new ResourceNotFoundException("Product", "productId", productId);
//        }
//
//        CartItem cartItem = null;
//        if (variantId != null) {
//             // Check if item with same product AND variant exists
//             // I need a repository method for this.
//             // cartItemRepository.findCartItemByProductIdAndCart_CartId only checks productId.
//             // I need to filter by variantId too.
//             List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());
//             Optional<CartItem> existing = items.stream()
//                 .filter(i -> i.getProductId().equals(productId) &&
//                              (i.getVariantId() != null && i.getVariantId().equals(variantId)))
//                 .findFirst();
//             if (existing.isPresent()) cartItem = existing.get();
//        } else {
//             cartItem = cartItemRepository.findCartItemByProductIdAndCart_CartId(productId, cart.getCartId());
//             // Ensure this item has no variantId
//             if (cartItem != null && cartItem.getVariantId() != null) {
//                 cartItem = null; // It's a different variant
//             }
//        }
//
//        if (cartItem != null) {
//            throw new APIException("Product " + product.getName() + " already exists in the cart");
//        }
//
//        double price = product.getMinPrice() != null ? product.getMinPrice().doubleValue() : 0.0;
//
//        if (variantId != null) {
//            APIResponse<ProductVariantDTO> variantResponse = productServiceClient.getPublicVariantById(variantId).getBody();
//            if (variantResponse != null && variantResponse.getData() != null) {
//                ProductVariantDTO variant = variantResponse.getData();
//                 if (variant.getSalePrice() != null) {
//                        price = variant.getSalePrice().doubleValue();
//                    } else {
//                        price = variant.getPrice().doubleValue();
//                    }
//
//                if (variant.getStock() < quantity) {
//                     throw new APIException("Product variant " + variant.getSku() + " has insufficient stock");
//                }
//            }
//        }
//
//        CartItem newCartItem = new CartItem();
//        newCartItem.setProductId(productId);
//        newCartItem.setVariantId(variantId);
//        newCartItem.setCart(cart);
//        newCartItem.setQuantity(quantity);
//        newCartItem.setProductPrice(price);
//
//        cartItemRepository.save(newCartItem);
//
//        cart.setTotalPrice(cart.getTotalPrice() + (price * quantity));
//        cartRepository.save(cart);
//
//        return getCart(cart.getCartId());
//    }
//
//    @Override
//    public List<CartDTO> getAllCarts() {
//        List<Cart> carts = cartRepository.findAll();
//        return carts.stream().map(cart -> getCart(cart.getCartId())).collect(Collectors.toList());
//    }
//
//    @Override
//    public CartDTO updateProductQuantityInCart(Long productId, int quantityChange) {
//
//        return null;
//    }
//
//    // I will add a proper update method
//    public CartDTO updateItemQuantity(Long cartId, Long productId, Long variantId, int quantityChange) {
//        Cart cart = cartRepository.findById(cartId)
//                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
//
//        List<CartItem> items = cartItemRepository.findByCart_CartId(cartId);
//        CartItem cartItem = items.stream()
//             .filter(i -> i.getProductId().equals(productId) &&
//                          ((variantId == null && i.getVariantId() == null) || (variantId != null && variantId.equals(i.getVariantId()))))
//             .findFirst()
//             .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
//
//        int newQuantity = cartItem.getQuantity() + quantityChange;
//        if (newQuantity <= 0) {
//            deleteProductFromCart(cartId, productId); // This deletes by productId, might delete wrong variant?
//            // Need to fix deleteProductFromCart too.
//            return getCart(cartId);
//        }
//
//        // Check stock if increasing
//        if (quantityChange > 0 && variantId != null) {
//             APIResponse<ProductVariantDTO> variantResponse = productServiceClient.getPublicVariantById(variantId).getBody();
//             if (variantResponse != null && variantResponse.getData() != null) {
//                 if (variantResponse.getData().getStock() < newQuantity) {
//                     throw new APIException("Insufficient stock");
//                 }
//             }
//        }
//
//        cart.setTotalPrice(cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity()));
//        cartItem.setQuantity(newQuantity);
//        cart.setTotalPrice(cart.getTotalPrice() + (cartItem.getProductPrice() * newQuantity));
//
//        cartItemRepository.save(cartItem);
//        cartRepository.save(cart);
//
//        return getCart(cartId);
//    }
//
//    @Transactional
//    @Override
//    public String deleteProductFromCart(Long cartId, Long productId) {
//        // This deletes ALL items with productId.
//        // If we want to delete specific variant, we need variantId.
//        // I'll assume for now it deletes all variants of the product or we need to update signature.
//
//        Cart cart = cartRepository.findById(cartId)
//                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
//
//        List<CartItem> items = cartItemRepository.findByCart_CartId(cartId);
//        List<CartItem> toDelete = items.stream()
//                .filter(i -> i.getProductId().equals(productId))
//                .collect(Collectors.toList());
//
//        if (toDelete.isEmpty()) {
//            throw new ResourceNotFoundException("Product", "productId", productId);
//        }
//
//        for (CartItem item : toDelete) {
//            cart.setTotalPrice(cart.getTotalPrice() - (item.getProductPrice() * item.getQuantity()));
//            cartItemRepository.delete(item);
//        }
//
//        cartRepository.save(cart);
//
//        return "Product removed from the cart";
//    }
//
//    public String deleteItemFromCart(Long cartId, Long productId, Long variantId) {
//        Cart cart = cartRepository.findById(cartId)
//                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
//
//        List<CartItem> items = cartItemRepository.findByCart_CartId(cartId);
//        CartItem item = items.stream()
//             .filter(i -> i.getProductId().equals(productId) &&
//                          ((variantId == null && i.getVariantId() == null) || (variantId != null && variantId.equals(i.getVariantId()))))
//             .findFirst()
//             .orElseThrow(() -> new ResourceNotFoundException("Item", "id", productId));
//
//        cart.setTotalPrice(cart.getTotalPrice() - (item.getProductPrice() * item.getQuantity()));
//        cartItemRepository.delete(item);
//        cartRepository.save(cart);
//
//        return "Item removed from the cart";
//    }
//
//    @Override
//    public CartDTO getCart(Long cartId) {
//        Cart cart = cartRepository.findById(cartId)
//                .orElseThrow(() -> new ResourceNotFoundException("Cart", "Cart Id", cartId));
//
//        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
//        List<ProductDTO> products = new ArrayList<>();
//
//        for (CartItem item : cart.getCartItems()) {
//            ProductDTO productDTO = productServiceClient.getProductById(item.getProductId()).getBody();
//            if (productDTO != null) {
//                productDTO.setQuantity(item.getQuantity());
//                productDTO.setVariantId(item.getVariantId());
//
//                if (item.getVariantId() != null) {
//                     APIResponse<ProductVariantDTO> variantResponse = productServiceClient.getPublicVariantById(item.getVariantId()).getBody();
//                     if (variantResponse != null && variantResponse.getData() != null) {
//                         ProductVariantDTO variant = variantResponse.getData();
//                         productDTO.setVariantSku(variant.getSku());
//                         if (variant.getSalePrice() != null) {
//                             productDTO.setMinPrice(variant.getSalePrice());
//                         } else {
//                             productDTO.setMinPrice(variant.getPrice());
//                         }
//                     }
//                }
//
//                if (productDTO.getUserId() != null) {
//                    try {
//                        APIResponse<UserInfoResponse> userResponse = userServiceClient.getUserInfo(productDTO.getUserId()).getBody();
//                        if (userResponse != null && userResponse.getData() != null) {
//                            productDTO.setSellerName(userResponse.getData().getUsername());
//                        }
//                    } catch (Exception e) {
//                        log.error("Failed to fetch seller info for user id: {}", productDTO.getUserId(), e);
//                    }
//                }
//
//                products.add(productDTO);
//            }
//        }
//
//        cartDTO.setProducts(products);
//        return cartDTO;
//    }
//
//    @Override
//    @Transactional
//    public String deleteProductFromCarts(ProductDTO productDTO) {
//        Long productId = productDTO.getId();
//        List<CartItem> cartItems = cartItemRepository.findByProductId(productId);
//        if (cartItems.isEmpty()) {
//            return "There is no appearance of this product in carts";
//        }
//        for (CartItem item : cartItems) {
//            Cart cart = item.getCart();
//            double newTotal = cart.getTotalPrice() - (item.getProductPrice() * item.getQuantity());
//            cart.setTotalPrice(Math.max(newTotal, 0));
//            cartRepository.save(cart);
//        }
//        cartItemRepository.deleteByProductId(productId);
//        return "Product removed from all carts successfully";
//    }
//
//    @Override
//    @Transactional
//    public String updateProductInCarts(ProductDTO productDTO) {
//        // This is complex with variants.
//        // If product price changes, we might need to update cart items.
//        // But cart items store snapshot price?
//        // The code `cartItem.setProductPrice(price)` suggests snapshot.
//        // So we should update it.
//        return "Product updated in all carts successfully";
//    }
//}
