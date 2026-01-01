package com.ecom.order.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.order")
public class OrderConfigurationProperties {
    private String defaultCurrency = "USD";
    private BigDecimal taxRate = BigDecimal.valueOf(0.10);
    private String paymentProvider = "stripe";
    private String paymentMethod = "card";
}
