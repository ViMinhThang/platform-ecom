package com.ecom.order.helper;

import com.ecom.order.config.OrderConfigurationProperties;
import com.ecom.order.dto.CartItemDTO;
import com.ecom.order.dto.CheckoutSessionDTO;
import com.ecom.order.dto.OrderGroupDTO;
import com.ecom.order.dto.SubOrderDTO;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.payment.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderMappingHelper {

    private final ModelMapper modelMapper;
    private final OrderConfigurationProperties properties;

    public CheckoutSessionDTO buildCheckoutSession(PaymentIntent intent, BigDecimal amount,
            Long addressId, Cart cart) {
        List<CartItemDTO> items = cart.getItems().stream()
                .map(item -> modelMapper.map(item, CartItemDTO.class))
                .collect(Collectors.toList());

        return CheckoutSessionDTO.builder()
                .clientSecret(intent.getClientSecret())
                .paymentIntentId(intent.getId())
                .amount(amount)
                .currency(properties.getDefaultCurrency())
                .addressId(addressId)
                .items(items)
                .build();
    }

    public OrderGroupDTO convertToDTO(OrderGroup group) {
        OrderGroupDTO dto = modelMapper.map(group, OrderGroupDTO.class);
        dto.setSubOrders(group.getSubOrders().stream()
                .map(so -> modelMapper.map(so, SubOrderDTO.class))
                .collect(Collectors.toList()));
        return dto;
    }
}
