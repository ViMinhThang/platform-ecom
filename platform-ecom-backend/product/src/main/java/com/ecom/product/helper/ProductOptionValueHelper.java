package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.entity.ProductOption;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.product.repository.ProductOptionValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductOptionValueHelper {

    private final ProductOptionValueRepository productOptionValueRepository;

    public ProductOptionValue findByIdOrThrow(Long id) {
        return productOptionValueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOptionValue", "optionValueId", id));
    }

    public void updateOptionValues(ProductOption option, List<ProductOptionValueDTO> valueDTOs) {
        if (valueDTOs == null)
            return;

        Map<Long, ProductOptionValue> existingValues = option.getValues().stream()
                .filter(v -> v.getId() != null)
                .collect(Collectors.toMap(ProductOptionValue::getId, v -> v));

        List<ProductOptionValue> updatedValues = valueDTOs.stream()
                .map(dto -> processOptionValue(dto, existingValues, option))
                .collect(Collectors.toList());

        option.getValues().clear();
        option.getValues().addAll(updatedValues);
    }

    private ProductOptionValue processOptionValue(ProductOptionValueDTO dto, Map<Long, ProductOptionValue> existing,
            ProductOption option) {
        if (dto.getId() != null && existing.containsKey(dto.getId())) {
            ProductOptionValue value = existing.get(dto.getId());
            value.setValue(dto.getValue());
            value.setDisplayValue(dto.getDisplayValue());
            value.setSortOrder(dto.getSortOrder());
            return value;
        } else {
            ProductOptionValue value = new ProductOptionValue();
            value.setValue(dto.getValue());
            value.setDisplayValue(dto.getDisplayValue());
            value.setSortOrder(dto.getSortOrder());
            value.setOption(option);
            return value;
        }
    }
}
