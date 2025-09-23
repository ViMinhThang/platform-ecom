package com.ecom.order.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReduceStockDTO {
    private Long productId;
    private Integer quantity;
}
