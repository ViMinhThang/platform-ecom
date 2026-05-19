package com.ecom.order.payment;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Factory for retrieving payment providers
 * Allows registration of multiple providers
 */
@Component
public class PaymentProviderFactory {

    private final Map<String, PaymentProvider> providers = new ConcurrentHashMap<>();

    /**
     * Register a payment provider
     */
    public void registerProvider(String name, PaymentProvider provider) {
        providers.put(name.toLowerCase(), provider);
    }

    public PaymentProvider getProvider(String providerName) {
        PaymentProvider provider = providers.get(providerName.toLowerCase());
        if (provider == null) {
            throw new IllegalArgumentException("Không tìm thấy nhà cung cấp thanh toán: " + providerName);
        }
        if (!provider.isAvailable()) {
            throw new IllegalStateException("Nhà cung cấp thanh toán không khả dụng: " + providerName);
        }
        return provider;
    }

    public List<String> getAvailableProviders() {
        return providers.entrySet().stream()
                .filter(entry -> entry.getValue().isAvailable())
                .map(Map.Entry::getKey)
                .toList();
    }

    public boolean hasProvider(String providerName) {
        return providers.containsKey(providerName.toLowerCase());
    }
}
