package com.ecom.order.service.signature;

import com.ecom.order.entity.Cart;

public interface CartValidationService {

    Cart getValidatedCart(Long userId);

    void enrichAndValidateCartItems(Cart cart);
}
