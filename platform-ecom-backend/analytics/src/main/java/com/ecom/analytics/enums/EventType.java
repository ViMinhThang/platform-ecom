package com.ecom.analytics.enums;

public enum EventType {
    PRODUCT_VIEW,           // User views a product detail page
    PRODUCT_CLICK,          // User clicks on a product card
    ADD_TO_CART,            // User adds item to cart
    REMOVE_FROM_CART,       // User removes item from cart
    PURCHASE,               // User completes purchase
    SEARCH,                 // User performs a search
    SEARCH_CLICK,           // User clicks a product from search results
    WISHLIST_ADD,           // User adds to wishlist
    WISHLIST_REMOVE,        // User removes from wishlist
    CATEGORY_VIEW,          // User views a category page
    SELLER_VIEW,            // User views a seller/store page
    CART_VIEW,              // User views their cart
    CHECKOUT_START,         // User starts checkout
    CHECKOUT_COMPLETE       // User completes checkout
}
