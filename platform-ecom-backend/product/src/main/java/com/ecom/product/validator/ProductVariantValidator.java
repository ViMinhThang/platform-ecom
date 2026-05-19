package com.ecom.product.validator;

import com.ecom.common.exception.APIException;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductVariantValidator {

    private final ProductVariantRepository productVariantRepository;

    public void validateNoDuplicateVariant(Long productId, Long variantId, ProductVariantDTO dto) {
        Set<Long> newOptionValueIds = extractOptionValueIds(dto);
        List<ProductVariant> otherVariants = findOtherVariants(productId, variantId);

        boolean duplicateExists = otherVariants.stream()
                .anyMatch(v -> hasSameOptionValues(v, newOptionValueIds));

        if (duplicateExists) {
            throw new APIException("A variant with the same option combination already exists.");
        }
    }

    private Set<Long> extractOptionValueIds(ProductVariantDTO dto) {
        if (dto.getOptionValues() == null)
            return Set.of();

        return dto.getOptionValues().stream()
                .map(opt -> opt.getProductOptionValue().getId())
                .collect(Collectors.toSet());
    }

    private List<ProductVariant> findOtherVariants(Long productId, Long variantId) {
        return productVariantRepository.findByProductId(productId).stream()
                .filter(v -> variantId == null || !v.getId().equals(variantId))
                .collect(Collectors.toList());
    }

    private boolean hasSameOptionValues(ProductVariant variant, Set<Long> targetIds) {
        Set<Long> existingIds = variant.getOptionValues().stream()
                .map(vo -> vo.getOptionValue().getId())
                .collect(Collectors.toSet());
        return existingIds.equals(targetIds);
    }
}
