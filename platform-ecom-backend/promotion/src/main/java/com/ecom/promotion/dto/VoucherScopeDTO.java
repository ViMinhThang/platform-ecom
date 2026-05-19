package com.ecom.promotion.dto;

import com.ecom.promotion.enums.ScopeType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherScopeDTO {
    private Long id;
    private ScopeType scopeType;
    private Long targetId;
}
