package com.ecom.promotion.dto.request;

import com.ecom.promotion.enums.ScopeType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScopeRequest {
    @NotNull
    private ScopeType scopeType;
    private Long targetId;
}
