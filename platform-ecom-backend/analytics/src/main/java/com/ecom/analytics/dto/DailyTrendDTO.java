package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyTrendDTO {
    
    private LocalDate date;
    private Long views;
    private Long orders;
    private BigDecimal revenue;
    private Long cartAdds;
    private Double conversionRate;
}
