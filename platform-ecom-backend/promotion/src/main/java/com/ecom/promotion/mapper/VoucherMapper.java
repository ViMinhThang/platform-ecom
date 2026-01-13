package com.ecom.promotion.mapper;

import com.ecom.promotion.dto.VoucherDTO;
import com.ecom.promotion.dto.VoucherScopeDTO;
import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.entity.VoucherScope;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class VoucherMapper {

    public VoucherDTO toDTO(Voucher voucher) {
        if (voucher == null)
            return null;

        return VoucherDTO.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .name(voucher.getName())
                .description(voucher.getDescription())
                .type(voucher.getType())
                .category(voucher.getCategory())
                .applyMode(voucher.getApplyMode())
                .status(voucher.getStatus())
                .discountValue(voucher.getDiscountValue())
                .minOrderAmount(voucher.getMinOrderAmount())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .usageLimit(voucher.getUsageLimit())
                .usageLimitPerUser(voucher.getUsageLimitPerUser())
                .currentUsageCount(voucher.getCurrentUsageCount())
                .startTime(voucher.getStartTime())
                .endTime(voucher.getEndTime())
                .saleCampaignId(voucher.getSaleCampaignId())
                .scopes(toScopeDTOs(voucher.getScopes()))
                .createdAt(voucher.getCreatedAt())
                .updatedAt(voucher.getUpdatedAt())
                .build();
    }

    public List<VoucherDTO> toDTOs(List<Voucher> vouchers) {
        return vouchers.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private List<VoucherScopeDTO> toScopeDTOs(List<VoucherScope> scopes) {
        if (scopes == null)
            return List.of();
        return scopes.stream()
                .map(s -> VoucherScopeDTO.builder()
                        .id(s.getId())
                        .scopeType(s.getScopeType())
                        .targetId(s.getTargetId())
                        .build())
                .collect(Collectors.toList());
    }
}
