package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.SaleCampaign;
import com.ecom.product.repository.SaleCampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SaleCampaignHelper {

    private final SaleCampaignRepository saleCampaignRepository;

    public SaleCampaign findByIdOrThrow(Long id) {
        return saleCampaignRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale campaign not found: " + id));
    }
}
