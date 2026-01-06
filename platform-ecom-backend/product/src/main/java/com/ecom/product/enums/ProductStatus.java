package com.ecom.product.enums;


public enum ProductStatus {

    DRAFT("DRAFT"),
    

    ACTIVE("ACTIVE"),
    

    OUT_OF_STOCK("OUT_OF_STOCK"),

    ARCHIVED("ARCHIVED");

    private final String value;

    ProductStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }


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
