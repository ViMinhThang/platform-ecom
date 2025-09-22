package com.ecom.order.repositories;

import com.ecom.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findCartItemByProductIdAndCartId(Long cartId, Long productId);

    void deleteCartItemByProductIdAndCartId(Long cartId, Long productId);

    void deleteAllByCartId(Long cartId);
}
