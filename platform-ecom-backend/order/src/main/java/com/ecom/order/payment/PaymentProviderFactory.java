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

    /**
     * Get provider by name
     */
    public PaymentProvider getProvider(String providerName) {
        PaymentProvider provider = providers.get(providerName.toLowerCase());
        if (provider == null) {
            throw new IllegalArgumentException("Payment provider not found: " + providerName);
        }
        if (!provider.isAvailable()) {
            throw new IllegalStateException("Payment provider not available: " + providerName);
        }
        return provider;
    }

    /**
     * Get all available providers
     */
    public List<String> getAvailableProviders() {
        return providers.entrySet().stream()
                .filter(entry -> entry.getValue().isAvailable())
                .map(Map.Entry::getKey)
                .toList();
    }

    /**
     * Check if provider exists
     */
    public boolean hasProvider(String providerName) {
        return providers.containsKey(providerName.toLowerCase());
    }
}
