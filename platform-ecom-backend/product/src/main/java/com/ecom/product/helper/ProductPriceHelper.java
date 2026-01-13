package com.ecom.product.helper;

import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class ProductPriceHelper {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductHelper productHelper;

    public void updateProductPriceRange(Long productId) {
        Product product = productHelper.findByIdOrThrow(productId);
        List<ProductVariant> activeVariants = productVariantRepository.findByProductIdAndHiddenFalse(productId);

        if (activeVariants.isEmpty()) {
            product.setMinPrice(null);
            product.setMaxPrice(null);
        } else {
            List<BigDecimal> prices = activeVariants.stream()
                    .map(ProductVariant::getPrice)
                    .filter(Objects::nonNull)
                    .toList();

            product.setMinPrice(prices.stream().min(BigDecimal::compareTo).orElse(null));
            product.setMaxPrice(prices.stream().max(BigDecimal::compareTo).orElse(null));
        }
        productRepository.save(product);
    }
}
