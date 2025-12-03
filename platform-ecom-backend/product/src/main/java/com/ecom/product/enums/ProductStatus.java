package com.ecom.product.enums;

/**
 * Enum representing the possible statuses of a product.
 * Replaces magic strings for better type safety and maintainability.
 */
public enum ProductStatus {
    /**
     * Product is in draft state and not visible to customers
     */
    DRAFT("DRAFT"),
    
    /**
     * Product is active and available for purchase
     */
    ACTIVE("ACTIVE"),
    
    /**
     * Product is out of stock
     */
    OUT_OF_STOCK("OUT_OF_STOCK"),
    
    /**
     * Product is archived and no longer available
     */
    ARCHIVED("ARCHIVED");

    private final String value;

    ProductStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * Gets ProductStatus from string value
     */
    public static ProductStatus fromValue(String value) {
        for (ProductStatus status : ProductStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid product status: " + value);
    }

    @Override
    public String toString() {
        return value;
    }
}
