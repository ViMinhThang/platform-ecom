package com.ecom.order.service.impl;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.InsufficientStockException;
import com.ecom.order.client.InventoryServiceClient;
import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.dto.ProductDetails;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.CartItem;
import com.ecom.order.helper.CartHelper;
import com.ecom.order.service.signature.CartValidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartValidationServiceImpl implements CartValidationService {

    private final ProductServiceClient productServiceClient;
    private final InventoryServiceClient inventoryServiceClient;
    private final CartHelper cartHelper;

    @Override
    public Cart getValidatedCart(Long userId) {
        Cart cart = cartHelper.findByUserIdOrThrow(userId);

        if (cart.getItems().isEmpty()) {
            throw new APIException(
                    "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.");
        }
        return cart;
    }

    @Override
    public void enrichAndValidateCartItems(Cart cart) {
        for (CartItem item : cart.getItems()) {
            ProductDetails details = fetchProductDetails(item);
            updateCartItemWithProductDetails(item, details);
            validateStockAvailability(item, details);
        }
    }

    private ProductDetails fetchProductDetails(CartItem item) {
        var response = productServiceClient.getProductDetails(item.getProductId(), item.getVariantId());

        if (response == null || !response.isSuccess() || response.getData() == null) {
            throw new IllegalStateException("Không tìm thấy sản phẩm: " + item.getProductId());
        }
        return response.getData();
    }

    private void updateCartItemWithProductDetails(CartItem item, ProductDetails details) {
        item.setProductName(details.getName());
        item.setImageUrl(details.getImageUrl());
        item.setSellerId(details.getSellerId());
        item.setSellerName(details.getSellerName());
        item.setVariantName(details.getVariantName());
    }

    private void validateStockAvailability(CartItem item, ProductDetails details) {
        try {
            boolean inStock = inventoryServiceClient.checkStock(
                    item.getVariantId(), item.getQuantity());

            if (!inStock) {
                throw new InsufficientStockException(
                        "Sản phẩm " + details.getName() + " đã hết hàng hoặc không đủ số lượng");
            }
        } catch (InsufficientStockException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Inventory service unavailable, falling back to product service for stock check", e);
            boolean inStock = productServiceClient.validateStock(
                    item.getProductId(), item.getVariantId(), item.getQuantity());
            if (!inStock) {
                throw new InsufficientStockException("Sản phẩm " + details.getName() + " đã hết hàng");
            }
        }
    }
}
