package com.ecom.order.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Webhook event parsed from payment provider
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEvent {
    private String id;
    private String type;
    private Object data;
    private String provider;
}
