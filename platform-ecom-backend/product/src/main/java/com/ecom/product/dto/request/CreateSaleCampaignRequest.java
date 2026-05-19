package com.ecom.product.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSaleCampaignRequest {

    @NotBlank(message = "Campaign name is required")
    private String name;

    private String description;

    private String bannerUrl;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @NotEmpty(message = "At least one category must be selected")
    private List<Long> categoryIds;

    @NotEmpty(message = "At least one discount tier must be defined")
    @Valid
    private List<DiscountTierRequest> discountTiers;
}
